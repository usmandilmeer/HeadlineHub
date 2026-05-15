FROM node:22-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


FROM node:22-slim AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

RUN npm install --omit=dev

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]