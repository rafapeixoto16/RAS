FROM alpine:3.21.2

RUN apk add nodejs npm python3

WORKDIR /app

COPY picturas/ ./

ARG SUBPROJECT=/

WORKDIR /app/${SUBPROJECT}

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
