FROM node:24 AS builder
WORKDIR /app

COPY package*.json ./
# you might want to add --build-from-source=sqlite3 here too.
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# FIX: Force sqlite3 to compile against the container's glibc 
RUN npm ci --only=production --build-from-source=sqlite3

FROM node:24
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
