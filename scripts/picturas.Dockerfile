FROM python:3.13-bookworm

WORKDIR /app

RUN apt update
RUN apt install nodejs npm ffmpeg libsm6 libxext6 -y

COPY picturas/ ./

ARG SUBPROJECT=/

WORKDIR /app/${SUBPROJECT}

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
