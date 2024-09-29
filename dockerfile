FROM node:14-alpine

COPY /App .

RUN npm install

EXPOSE 5000

CMD ["node", "server.js"]
