FROM node:22-alpine AS build

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine AS production

WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY --from=build /app/dist ./dist

COPY --from=build /app/.env.example ./dist/.env
# Run the application.
ENV APP_PORT=3000

CMD ["node", "dist/server.js"]