FROM node:8-alpine

ENV OS_VIEWER_BASE_PATH=viewer/

RUN apk add --update git

WORKDIR /app
ADD package.json .
RUN npm install

ADD . .
RUN npm run build

ADD docker/settings.json /app/settings.json

EXPOSE 8000

CMD API_URL="${OS_EXTERNAL_ADDRESS}" cd /app && npm start
