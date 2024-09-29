FROM node:14-alpine AS backend

WORKDIR /App
COPY . /App

RUN npm install

EXPOSE 5000

CMD ["node", "server.js"]

FROM nginx:alpine

COPY /App/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
