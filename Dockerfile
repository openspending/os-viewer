FROM node:8.10-alpine

WORKDIR /app
COPY package.json .

RUN apk add --update --no-cache --virtual=build-dependencies \
    git \
    && npm install \
    && apk del build-dependencies \
    && rm -rf /var/cache/apk/*


COPY docker/settings.json /app/settings.json
COPY . .
RUN npm run build

EXPOSE 8000

CMD cd /app && npm start
