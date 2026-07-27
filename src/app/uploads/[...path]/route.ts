import { createReadStream, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { Readable } from "node:stream";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { contentTypeFor, UPLOAD_DIR } from "@/lib/uploads";

// Upload filenames are random hex and never change once written, so they can be
// cached aggressively.
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=31536000, immutable",
};

/**
 * Serves runtime-uploaded files from disk on every request.
 *
 * We can't rely on Next's `public/` static serving for these: under
 * `output: "standalone"` files written to `public/` at runtime are not
 * registered as servable assets (returns 404). This handler reads directly from
 * the persistent uploads volume and mirrors the write path used by
 * `src/actions/upload.ts` (shared via `@/lib/uploads`), so the two never drift.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path: segments } = await params;

  if (!segments || segments.length === 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  // Resolve inside UPLOAD_DIR and reject any path-traversal attempt (`..`).
  const resolved = resolve(UPLOAD_DIR, ...segments);
  if (!resolved.startsWith(`${UPLOAD_DIR}/`)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!existsSync(resolved) || !statSync(resolved).isFile()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const stream = Readable.toWeb(createReadStream(resolved)) as ReadableStream;
  return new NextResponse(stream, {
    headers: {
      "Content-Type": contentTypeFor(resolved),
      ...CACHE_HEADERS,
    },
  });
}
