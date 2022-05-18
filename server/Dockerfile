FROM node:16-slim

ENV SERVER_PORT 3000

WORKDIR /app

COPY server server/
COPY prisma prisma/
COPY package.json .
# COPY package-lock.json ./package-lock.json

RUN apt-get update && \
    apt-get install -y openssl && \
    yarn install && \
    yarn prisma-build

CMD [ "yarn", "start" ]
