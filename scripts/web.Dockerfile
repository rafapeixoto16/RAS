FROM node:lts-alpine AS build-stage

WORKDIR /app

COPY picturas_web/package*.json ./
RUN npm install

COPY picturas_web/ .
RUN npm run build

FROM nginx:stable-alpine

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY elements/ /usr/share/nginx/html
COPY ./scripts/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
