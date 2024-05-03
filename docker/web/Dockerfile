FROM node:18 AS builder
ARG WEB_API_URL
ENV REACT_APP_API_URL=${WEB_API_URL}
ENV NODE_OPTIONS=--openssl-legacy-provider
WORKDIR /home/app
COPY ./web/package*.json ./
COPY ./web/tsconfig.json ./
COPY ./web/craco.config.js ./
RUN yarn install
COPY ./web/src ./src
COPY ./web/public ./public
RUN yarn build

FROM nginx
WORKDIR /usr/share/nginx/html
COPY --from=builder ./home/app/build ./
COPY ./docker/web/nginx.conf /etc/nginx/nginx.conf