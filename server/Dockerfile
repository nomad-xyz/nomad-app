FROM node:16
ENV NODE_ENV=production

WORKDIR /app
ENV SERVER_PORT 3000

COPY server server/
COPY prisma prisma/
COPY package.json .
# COPY package-lock.json ./package-lock.json

RUN yarn install

CMD [ "yarn", "start" ]
