FROM node:16
ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./package.json
# COPY package-lock.json ./package-lock.json
RUN yarn install

ADD src /app/
ADD prisma /app/prisma

RUN yarn build

CMD [ "yarn", "start" ]
