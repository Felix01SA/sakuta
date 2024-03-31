FROM node:lts-alpine as dependencies
    WORKDIR /app
    COPY package.json .
    RUN apk add --no-cache --virtual .build-deps alpine-sdk python3 && \
        npm ci --silent && \
        apk del .build-deps

FROM node:lts-alpine as builder
    WORKDIR /app
    COPY src ./src
    COPY tsconfig.json .
    COPY --from=dependencies /app/package.json .
    COPY --from=dependencies /app/package-lock.json .
    COPY --from=dependencies /app/node_modules /app/node_modules

    RUN npm run build

FROM node:lts-alpine as preparer
    WORKDIR /app
    COPY --from=builder /app/dist /app/dist
    COPY --from=builder /app/package.json /app/package.json
    COPY --from=builder /app/package-lock.json /app/package-lock.json
    COPY --from=builder /app/node_modules /app/node_modules

    RUN npm prune --omit=dev

FROM node:lts-alpine as runner
    WORKDIR /app
    ARG NODE_ENV=production
    ENV NODE_ENV ${NODE_ENV}
    COPY --from=preparer /app/dist /app/dist
    COPY --from=preparer /app/package.json /app/package.json
    COPY --from=preparer /app/package-lock.json /app/package-lock.json
    COPY --from=preparer /app/node_modules /app/node_modules

    CMD [ "npm", "run", "start" ]

