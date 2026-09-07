FROM node:24-alpine AS base

FROM base AS deps
WORKDIR /app

COPY App/package.json ./
COPY App/package-lock.json ./

RUN npm ci --omit=dev --no-audit --no-fund

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 killer

COPY --from=deps --chown=killer:nodejs /app/node_modules ./node_modules
COPY --chown=killer:nodejs App/server.js ./
COPY --chown=killer:nodejs App/public ./public

RUN chown killer:nodejs /app

USER killer

EXPOSE 5000

ENV PORT=5000

CMD ["node", "server.js"]
