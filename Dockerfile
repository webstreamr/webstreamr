FROM node:22.15-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

RUN npm ci --only=production

FROM node:22.15-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ARG PORT

ARG MANIFEST_ID
RUN test -n "$MANIFEST_ID" || (echo "MANIFEST_ID is not set" && exit 1)

ARG MANIFEST_NAME
RUN test -n "$MANIFEST_NAME" || (echo "MANIFEST_NAME is not set" && exit 1)

ENV MANIFEST_ID=$MANIFEST_ID
ENV MANIFEST_NAME=$MANIFEST_NAME
ENV NODE_ENV=production
ENV PORT=$PORT

CMD ["node", "dist/server.js"]
