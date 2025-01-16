FROM node:lts-alpine AS build-stage

WORKDIR /app

COPY picturas_web/package*.json ./
RUN npm install

COPY picturas_web/ .
RUN npm run build

FROM nginx:stable-alpine

WORKDIR /app

RUN apk add --no-cache curl tar
RUN curl -L -o nginx-prometheus-exporter.tar.gz https://github.com/nginx/nginx-prometheus-exporter/releases/download/v1.4.1/nginx-prometheus-exporter_1.4.1_linux_amd64.tar.gz
RUN tar -xzf nginx-prometheus-exporter.tar.gz
RUN mv nginx-prometheus-exporter /usr/local/bin/nginx-prometheus-exporter
RUN chmod +x /usr/local/bin/nginx-prometheus-exporter

WORKDIR /

RUN rm -rf /app

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./scripts/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 9113

CMD ["sh", "-c", "nginx && nginx-prometheus-exporter --nginx.scrape-uri=http://127.0.0.1/nginx_status"]
