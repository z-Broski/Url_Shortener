# Dockerfile for React client

# Build react client
FROM node:18-alpine3.15
# 10.16-alpine

# Working directory be app
WORKDIR /usr/src/app

COPY package*.json ./
#ADD package.json /usr/src/app/package.json
###  Installing dependencies

RUN npm install --silent

# copy local files to app folder
COPY . .

EXPOSE 3000

CMD ["npm","start"]