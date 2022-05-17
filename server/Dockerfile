FROM node:16-alpine

ENV SERVER_PORT 3000

WORKDIR /app

COPY server server/
COPY prisma prisma/
COPY package.json .
# COPY package-lock.json ./package-lock.json

RUN yarn install

CMD [ "yarn", "start" ]
    