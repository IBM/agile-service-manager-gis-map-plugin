FROM node:16

LABEL version="1.1.0"

EXPOSE 3000
EXPOSE 3443

WORKDIR /app

COPY ./node_modules /app/node_modules
COPY ./package.json /app
COPY ./public /app/public
COPY ./src /app/src
COPY index.js /app

CMD ["npm", "start"]