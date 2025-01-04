FROM node:lts

WORKDIR /app

RUN apt update
RUN apt install python3.11-venv ffmpeg libsm6 libxext6 -y

COPY picturas/ ./

ARG SUBPROJECT=/

WORKDIR /app/${SUBPROJECT}

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]
