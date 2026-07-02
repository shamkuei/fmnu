FROM node:22-alpine AS base
RUN apk add --no-cache python3 make g++
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS builder
COPY . .
RUN pnpm build
# Bundle the migration runner into a self-contained ESM file so the slim
# runner image doesn't need drizzle-orm in node_modules. better-sqlite3 stays
# external because Next's standalone output already ships the native binding.
RUN pnpm exec esbuild src/db/migrate.ts --bundle --platform=node --format=esm \
	--outfile=.next/standalone/migrate.mjs --external:better-sqlite3

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Pre-create the data dir with the runtime user's ownership so the named
# volume mounted at /app/data inherits write permissions on first start.
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle

COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
