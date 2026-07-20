# Push deploy over a Cloudflare Tunnel

This replaces the old SSH-from-GitHub deploy. GitHub-hosted runners are US/Azure
IPs, and an **Iran-hosted server filters inbound SSH/TCP from foreign
datacenters**, so the SSH deploy times out (`dial tcp …:22: i/o timeout`).
Pushing the code over an HTTP webhook fronted by a Cloudflare Tunnel avoids
that — and the server no longer needs to reach `github.com` for a `git pull`.

## How it works

1. **GitHub Action** (`/.github/workflows/deploy.yml`): `git archive HEAD | gzip`
   the repo, HMAC-SHA256-sign it, and POST it to the webhook URL.
2. **Server** (`webhook.py`, fronted by `cloudflared`): verify the signature,
   sync the tarball into the app dir (preserving `.env`), and run
   `docker compose up -d --build`. The **DB and uploads live in Docker named
   volumes** (`db-data`, `uploads`), so replacing the app dir never touches
   production data.

```
GitHub runner (US) ──HTTPS──▶ Cloudflare edge ──tunnel──▶ cloudflared (on server) ──▶ 127.0.0.1:8000 webhook
```

## One-time server setup

Run on the VPS (Ubuntu 24.04, which ships Python 3.12):

```sh
# 1. Install cloudflared from Cloudflare's package repo
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /etc/apt/keyrings/cloudflare-main.gpg >/dev/null
echo "deb [signed-by=/etc/apt/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared $(lsb_release -cs) main" \
  | sudo tee /etc/apt/sources.list.d/cloudflared.list
sudo apt-get update && sudo apt-get install -y cloudflared

# 2. Create a tunnel in the Cloudflare Zero Trust dashboard:
#    One Gateway → Networks → Tunnels → Create a tunnel.
#    Pick a name, copy the TOKEN, and add a Public Hostname, e.g.
#      deploy.yourdomain.tld  →  HTTP  localhost:8000
#    Then install the connector on the server:
sudo cloudflared service install "<PASTE TOKEN>"

# 3. Install the receiver
sudo mkdir -p /opt/fmnu-deploy
sudo cp webhook.py /opt/fmnu-deploy/
sudo cp webhook.service /etc/systemd/system/

# 4. Create the env file. Generate a long random secret and note it —
#    you'll paste the SAME value into GitHub.
SECRET=$(openssl rand -hex 32)
echo "Generated secret (keep safe): $SECRET"
sudo tee /etc/fmnu-deploy.env >/dev/null <<EOF
DEPLOY_SECRET=$SECRET
DEPLOY_DEST=$HOME/fmnu
PORT=8000
EOF

# 5. Enable the webhook service
sudo systemctl daemon-reload
sudo systemctl enable --now webhook
systemctl status webhook --no-pager

# 6. Sanity check from your own laptop (anywhere on the internet):
curl -fsS https://deploy.yourdomain.tld/healthz   # → {"ok": true}
```

> `DEPLOY_DEST` must be the **absolute** path to where the app lives (e.g.
> `/home/app/fmnu`). The service runs as root, so don't rely on `~`.

## GitHub repo secrets

Add under **Settings → Secrets and variables → Actions**:

| Secret | Value |
| --- | --- |
| `DEPLOY_WEBHOOK_URL` | `https://deploy.yourdomain.tld/deploy` |
| `DEPLOY_SECRET` | the `$SECRET` you generated on the server |

You can now delete the old `SERVER_HOST`, `SERVER_USER`, `SERVER_SSH_KEY`
secrets — they're no longer used.

## Trigger a deploy

Push to `main`, or run the workflow manually (**Actions → Deploy → Run
workflow**). The Action streams the server's build log and fails the job if the
server doesn't confirm success (`__DEPLOY_RESULT__ OK`).

## Notes / troubleshooting

- **First deploy:** make sure `~/fmnu/.env` exists on the server with the
  runtime vars (`SMS_USERNAME`, `SMS_PASSWORD`, `SMS_FROM`, `CERTBOT_EMAIL`,
  …). It's preserved across deploys. If `STAGING=1` is set in
  `docker-compose.yml`, switch it to `0` once Let's Encrypt issuance works and
  wipe the `nginx-certs` volume.
- **cloudflared flaky from Iran?** It makes an *outbound* connection to
  Cloudflare's edge, which is generally reachable, but if your provider blocks
  it, run cloudflared through your existing workaround (e.g. a domestic
  `https_proxy`) — the receiver itself needs no inbound port.
- **Logs:** `journalctl -u webhook -f` (receiver) and `journalctl -u cloudflared -f`.
