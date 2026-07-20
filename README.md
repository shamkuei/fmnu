# fmnu

Online restaurant menu platform. Persian (Farsi) / RTL-first, phone-OTP authentication, per-restaurant theming. Each restaurant gets a public menu at `https://<domain>/r/<slug>` and an admin editor for menu CRUD.

For architecture, module boundaries, and domain model, see **[PROJECT.md](./PROJECT.md)**. For the theming/CSS system, see **[STYLING.md](./STYLING.md)**.

## Prerequisites

- Node 22+
- pnpm (enabled via corepack)
- Native build tools for `better-sqlite3`: `python3 make g++` (installed by default on most Linux distros; on Alpine `apk add python3 make g++`)

## Local development

```bash
cp .env.example .env.local       # adjust values as needed
pnpm install
pnpm db:push                     # create dev.db from src/db/schema.ts
pnpm dev
```

The app starts on http://localhost:3000. `DATABASE_URL` defaults to `dev.db` if unset.

With `NO_SMS=true` (the default in `.env.example`), OTP codes are printed to the server console instead of being sent — set `NO_SMS=false` and provide `SMS_USERNAME` / `SMS_PASSWORD` / `SMS_FROM` (Payamak Panel) to send real texts.

## Environment variables

| Variable | Purpose | Default |
|---|---|---|
| `DATABASE_URL` | SQLite file path | `dev.db` |
| `NEXT_PUBLIC_DOMAIN` | Public domain used to build `/r/<slug>` URLs | `fmnu.ir` |
| `NO_SMS` | When not `false`, OTP codes are logged instead of sent | `true` |
| `SMS_USERNAME` / `SMS_PASSWORD` / `SMS_FROM` | Payamak Panel credentials (required when `NO_SMS=false`) | — |
| `ROOT_PHONE` / `ROOT_PASSWORD` | Permanent platform superadmin, created/updated on every boot (sign in with phone + password). Change `ROOT_PASSWORD` to rotate. | — |
| `NODE_ENV` | Standard Next.js | `development` |

See [`.env.example`](./.env.example) for the full list.

> **Auth:** sign in with **phone + password** (works without SMS) or, when the SMS
> panel is active, with a one-time code. The `ROOT_*` env creates a platform
> superadmin that can manage users and impersonate them from `/admin/users`.

## Production deployment (Docker)

The stack runs two containers: the Next.js app and an `nginx-certbot` proxy that terminates TLS and auto-renews certs via Let's Encrypt.

```
internet ─► proxy (nginx + certbot, :80/:443) ─► app (:3000)
```

### Prerequisites

- DNS: an A record pointing `fmnu.ir` at the host's public IPv4 address.
- Ports 80 and 443 reachable from the public internet (Let's Encrypt's HTTP-01 challenge uses :80).
- `CERTBOT_EMAIL` set in `.env` (used for cert expiry warnings).

### First deploy (staging certs)

The compose file ships with `STAGING=1`, which issues untrusted Let's Encrypt test certs. This protects you from rate limits while you verify issuance works. Start the stack:

```bash
docker compose up -d --build
```

Watch the proxy logs until you see a successful `Certificate delivered` (the first boot also generates DH params, which takes 1–3 minutes before issuance can begin):

```bash
docker compose logs -f proxy
```

Once a staging cert is issued, verify the chain works (browser will warn about the untrusted issuer — expected). Then flip to production certs:

```sh
# Stop the stack
docker compose down

# Wipe the staging certs from the volume
docker volume rm fmnu_nginx-certs

# Edit docker-compose.yml and set STAGING=0, then bring it back up
docker compose up -d --build
docker compose logs -f proxy    # watch for the real cert issuance
```

### Volumes

`docker-compose.yml` mounts three named volumes:

- `db-data` → `/app/data` (holds `prod.db`, pointed to by `DATABASE_URL=/app/data/prod.db`)
- `uploads` → `/app/public/uploads` (user-uploaded images)
- `nginx-certs` → `/etc/letsencrypt` (issued certs + DH params)

The app listens on port `3000` (container-internal only — the proxy is the only thing on `:80`/`:443`). The entrypoint pre-creates `/app/data` with the runtime user's ownership so the named volume inherits write permissions on first start, then applies pending Drizzle migrations before `node server.js`.

Pass deployment-specific env via a `.env` file next to `docker-compose.yml` (`CERTBOT_EMAIL`, SMS credentials, `NEXT_PUBLIC_DOMAIN`, etc.).

## Schema changes

```bash
pnpm db:generate                 # create a new ./drizzle/<timestamp>_*.sql migration
```

Commit the generated files in `./drizzle/`. On the next `docker compose up -d --build`, the entrypoint's `migrate()` call applies any pending migrations to `prod.db` automatically. No manual `db:push` against production.
