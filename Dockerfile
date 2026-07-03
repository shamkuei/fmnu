FROM node:24
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/* && corepack enable
RUN corepack prepare pnpm@11.9.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i
COPY ./ ./

RUN pnpm build
EXPOSE $PORT
CMD ["pnpm","run", "start"]
