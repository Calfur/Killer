FROM node:14-alpine AS backend

WORKDIR /app
COPY . /app

RUN npm install

EXPOSE 5000

CMD ["node", "server.js"]

FROM nginx:alpine

COPY /app/public /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
