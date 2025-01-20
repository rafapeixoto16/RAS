FROM python:3.13.1-bookworm

RUN apt-get update
RUN apt-get install nodejs npm -y

WORKDIR /app

COPY picturas/ ./

ARG SUBPROJECT=/

WORKDIR /app/${SUBPROJECT}

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
