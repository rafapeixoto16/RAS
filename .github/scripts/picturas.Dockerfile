FROM node:lts-alpine

WORKDIR /app

COPY picturas/ ./
RUN npm install

ARG SUBPROJECT=/

WORKDIR /app/${SUBPROJECT}

EXPOSE 3000

CMD ["npm", "run", "start"]
