FROM node:10-slim as nodebuildfrontend

WORKDIR /app

COPY package.json /app/

RUN npm install -g typescript --quiet
RUN npm install --quiet

COPY ./ /app/

ARG env=prod

RUN npm run build

FROM nginx:1.15

RUN apt-get update && apt-get install -y python-certbot-nginx

RUN certbot certonly --authenticator standalone -m benjamin.albrecht@hs-bochum.de --agree-tos --rsa-key-size 4096 -d vongpiler.de -d www.vongpiler.de

COPY --from=nodebuildfrontend /app/dist/ /usr/share/nginx/html

COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf