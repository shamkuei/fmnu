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
| `NODE_ENV` | Standard Next.js | `development` |

See [`.env.example`](./.env.example) for the full list.

## Production deployment (Docker)

The image bundles a standalone Next.js server and runs Drizzle migrations on every start via `docker-entrypoint.sh`.

```bash
docker compose up -d --build
```

`docker-compose.yml` mounts two named volumes:

- `db-data` → `/app/data` (holds `prod.db`, pointed to by `DATABASE_URL=/app/data/prod.db`)
- `uploads` → `/app/public/uploads` (user-uploaded images)

The app listens on port `3000`. The entrypoint pre-creates `/app/data` with the runtime user's ownership so the named volume inherits write permissions on first start, then applies pending migrations before `node server.js`.

Pass deployment-specific env via a `.env` file next to `docker-compose.yml` (SMS credentials, `NEXT_PUBLIC_DOMAIN`, etc.).

## Schema changes

```bash
pnpm db:generate                 # create a new ./drizzle/<timestamp>_*.sql migration
```

Commit the generated files in `./drizzle/`. On the next `docker compose up -d --build`, the entrypoint's `migrate()` call applies any pending migrations to `prod.db` automatically. No manual `db:push` against production.
