FROM python:3.13.1-alpine3.21

RUN apk add nodejs npm

WORKDIR /app

COPY picturas/ ./

ARG SUBPROJECT=/

WORKDIR /app/${SUBPROJECT}

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
