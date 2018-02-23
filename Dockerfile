FROM node:8-alpine

RUN apk add --update git

WORKDIR /app
ADD package.json .
RUN npm install

ADD . .
RUN npm run build

ADD docker/settings.json /app/settings.json

EXPOSE 8000

CMD cd /app && npm start
