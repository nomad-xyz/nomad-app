FROM node:16
ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./package.json
# COPY package-lock.json ./package-lock.json
RUN yarn install

ADD server /app/
ADD prisma /app/prisma

RUN yarn prisma-build

CMD [ "yarn", "start" ]
