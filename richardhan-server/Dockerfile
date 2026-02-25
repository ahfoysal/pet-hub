FROM node:20 AS builder
WORKDIR /app

COPY package.json .

RUN npm install --force

COPY prisma ./prisma
COPY prisma.config.ts ./

COPY . .

# ENV DATABASE_URL=postgres://$PG_USERNAME:$PG_PASSWORD@$PG_HOST:$PG_PORT/$PG_DATABASE?schema=public
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
RUN DATABASE_URL=postgresql://dummy@localhost:5432/dummy npm run prisma:generate
RUN npm run build


FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

ENV NODE_ENV=production
ENV PORT=7000
EXPOSE 7000

CMD ["npm", "run", "start:docker"]
