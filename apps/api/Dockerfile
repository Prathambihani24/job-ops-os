FROM node:24-bookworm-slim

WORKDIR /app

COPY package.json ./
COPY apps ./apps
COPY scripts ./scripts

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "./apps/api/src/server.js"]
