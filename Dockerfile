FROM node:20-alpine AS build
RUN npm update -g npm
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist .
COPY --from=build /app/node_modules ./node_modules

ENTRYPOINT ["node", "main.js"]
