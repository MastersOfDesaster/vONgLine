FROM node:10-slim

RUN apt-get update

RUN  apt-get install -y \
     apt-transport-https \
     ca-certificates \
     curl \
     gnupg2 \
     software-properties-common

RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -

RUN add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"

RUN apt-get update

RUN apt-get install -y docker-ce

WORKDIR /app

COPY . /app

RUN npm install -g typescript
RUN npm install  && tsc

# Configure cron
COPY crontab /etc/cron/crontab

# Init cron
RUN crontab /etc/cron/crontab

EXPOSE 8443

CMD ["sh","-c","crond -f && npm start && "]
