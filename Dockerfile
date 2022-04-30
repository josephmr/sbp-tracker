FROM node:16

WORKDIR /usr/src/app

ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 8080

USER node
CMD ["node", "index.js"]