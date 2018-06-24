FROM node:10-slim

WORKDIR /backend

COPY . /backend
RUN npm install -g typescript
RUN npm install  && tsc

EXPOSE 3000
CMD ["npm", "start"]