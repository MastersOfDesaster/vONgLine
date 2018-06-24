FROM node:10-slim

WORKDIR /server

COPY . /server
RUN npm install -g typescript --quiet
RUN npm install --quiet

EXPOSE 3000
CMD ["npm", "start"]