FROM node:24.21.0-alpine3.23 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN apk add --no-cache python3 make g++ \
    && npm ci --omit=dev
FROM node:24.21.0-alpine3.23
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY . .
RUN rm -rf /usr/local/lib/node_modules/npm \
    /usr/local/bin/npm \
    /usr/local/bin/npx
EXPOSE 3000
RUN chown -R node:node /usr/src/app
USER node
CMD ["node", "./bin/www"]