#!/usr/bin/env python3
"""Push-deploy webhook receiver.

Sits behind a Cloudflare Tunnel (binds 127.0.0.1 only) and accepts a signed
gzipped tarball — produced by the GitHub Action via `git archive HEAD | gzip`
— at ``POST /deploy``. It verifies the HMAC signature, syncs the tarball into
the app directory (preserving the runtime ``.env``), and runs
``docker compose up -d --build``.

Why this exists: GitHub-hosted runners are US/Azure IPs, and an Iran-hosted
server filters inbound SSH/TCP from foreign datacenters, so the old
SSH-from-GitHub deploy times out. Pushing the code over a Cloudflare-fronted
HTTP webhook sidesteps that — and the server no longer needs to reach
github.com for a ``git pull`` either.

The database and uploads live in Docker named volumes (``db-data``,
``uploads``), so replacing the app directory is safe.

Environment:
  DEPLOY_SECRET    shared HMAC secret (required; must match the GitHub secret)
  DEPLOY_DEST      app directory on the server, e.g. /home/app/fmnu
  PORT             listen port (default 8000)
  DEPLOY_TIMEOUT   per-command timeout in seconds (default 1200)

Requires Python 3.12+ (uses the ``tarfile`` "data" extraction filter).
"""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import shutil
import subprocess
import sys
import tarfile
import tempfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

SECRET = os.environ["DEPLOY_SECRET"].encode()
DEST = os.environ.get("DEPLOY_DEST", os.path.expanduser("~/fmnu"))
PORT = int(os.environ.get("PORT", "8000"))
MAX_BODY = 300 * 1024 * 1024  # 300 MB
DEPLOY_TIMEOUT = int(os.environ.get("DEPLOY_TIMEOUT", "1200"))
# Files/dirs in DEST that must survive a redeploy (the tarball never contains
# these — they're gitignored — but we keep them explicit for safety).
KEEP = {".env"}

if sys.version_info < (3, 12):
    sys.exit("Python 3.12+ required for the safe tarfile 'data' filter.")


def verify(body: bytes, sig_header: str | None) -> bool:
    """Constant-time HMAC-SHA256 check. Header format: ``sha256=<hex>``."""
    if not sig_header:
        return False
    try:
        algo, _, sig = sig_header.partition("=")
    except ValueError:
        return False
    if algo != "sha256":
        return False
    expected = hmac.new(SECRET, body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(sig.strip(), expected)


def safe_extract(tarball: str, dest: str) -> None:
    """Extract with the 'data' filter (blocks path traversal / special files)."""
    with tarfile.open(tarball, "r:gz") as tf:
        tf.extractall(dest, filter="data")


def sync_into(src: str) -> None:
    """Replace DEST's contents with src/, preserving anything in KEEP."""
    os.makedirs(DEST, exist_ok=True)
    for name in os.listdir(DEST):
        if name in KEEP:
            continue
        p = os.path.join(DEST, name)
        if os.path.isdir(p) and not os.path.islink(p):
            shutil.rmtree(p)
        else:
            os.unlink(p)
    for name in os.listdir(src):
        shutil.move(os.path.join(src, name), os.path.join(DEST, name))


class Handler(BaseHTTPRequestHandler):
    server_version = "fmnu-deploy/1.0"
    # Stay on HTTP/1.0 so the streamed build log is close-delimited (no
    # Content-Length / chunked encoding needed); the client reads to EOF.

    def _json(self, code: int, payload: dict) -> None:
        body = json.dumps(payload).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _stream(self, cmd: list[str]) -> bool:
        """Run cmd in DEST, stream merged stdout/stderr to the client."""
        proc = subprocess.Popen(
            cmd,
            cwd=DEST,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
        )
        try:
            assert proc.stdout is not None
            for line in proc.stdout:
                self.wfile.write(line.encode())
                self.wfile.flush()
            proc.wait(timeout=DEPLOY_TIMEOUT)
            return proc.returncode == 0
        except Exception:
            proc.terminate()
            proc.wait()
            raise

    def do_GET(self) -> None:
        if self.path.rstrip("/") == "/healthz":
            self._json(200, {"ok": True})
        else:
            self._json(404, {"ok": False, "error": "not found"})

    def do_POST(self) -> None:
        if self.path.rstrip("/") != "/deploy":
            self._json(404, {"ok": False, "error": "not found"})
            return

        length = int(self.headers.get("Content-Length") or 0)
        if not 0 < length <= MAX_BODY:
            self._json(413, {"ok": False, "error": "invalid body size"})
            return

        body = self.rfile.read(length)
        if not verify(body, self.headers.get("X-Signature")):
            self._json(401, {"ok": False, "error": "bad signature"})
            return

        tmp = tempfile.mkdtemp(prefix="fmnu-deploy-")
        try:
            tarball = os.path.join(tmp, "payload.tar.gz")
            with open(tarball, "wb") as f:
                f.write(body)
            extract_dir = os.path.join(tmp, "extracted")
            safe_extract(tarball, extract_dir)
            sync_into(extract_dir)
        except Exception as e:
            shutil.rmtree(tmp, ignore_errors=True)
            self._json(500, {"ok": False, "error": repr(e)})
            return
        finally:
            shutil.rmtree(tmp, ignore_errors=True)

        # Stream the build so the connection stays active (avoids idle
        # timeouts on long builds). Status is already 200; success/failure is
        # signalled by the trailing marker line.
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.end_headers()
        try:
            ok = self._stream(["docker", "compose", "up", "-d", "--build"])
            self._stream(["docker", "image", "prune", "-f"])
            marker = "OK" if ok else "FAIL"
        except subprocess.TimeoutExpired:
            marker = "FAIL (timeout)"
        except Exception as e:  # noqa: BLE001 — surface any failure to CI
            marker = f"FAIL ({e!r})"
        self.wfile.write(f"\n__DEPLOY_RESULT__ {marker}\n".encode())
        self.wfile.flush()

    def log_message(self, fmt: str, *args) -> None:
        sys.stderr.write(f"{self.address_string()} {fmt % args}\n")


def main() -> None:
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"fmnu-deploy listening on 127.0.0.1:{PORT} -> {DEST}", flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        srv.shutdown()


if __name__ == "__main__":
    main()
