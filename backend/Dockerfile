FROM node:10-slim

WORKDIR /app

COPY . /app
RUN npm install -g typescript
RUN npm install  && tsc

EXPOSE 3000
CMD ["npm", "start"]