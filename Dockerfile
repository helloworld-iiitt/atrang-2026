# syntax=docker/dockerfile:1

# Production image for the Atrang website (Next.js standalone server).
#   docker build -t atrang .
#   docker run -p 3000:3000 atrang

ARG NODE_IMAGE=node:22-alpine

# ---- Base ---------------------------------------------------------------------
FROM ${NODE_IMAGE} AS base
# Skip npm's "new version available" check; the image pins its own Node/npm.
ENV NPM_CONFIG_UPDATE_NOTIFIER=false \
    NEXT_TELEMETRY_DISABLED=1

# ---- Dependencies -------------------------------------------------------------
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# ---- Build --------------------------------------------------------------------
FROM base AS builder
WORKDIR /app
# Public URL of the deployed site, used for absolute links in social previews.
# It is baked into the build, so pass it at build time: --build-arg NEXT_PUBLIC_SITE_URL=https://...
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Runtime ------------------------------------------------------------------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", "server.js"]
