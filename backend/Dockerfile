#here we're specifying the version of node
#we can use the :latest tag as well.
FROM node:14-slim

#here we're defining the working directory
WORKDIR /user/src/app

#copying our dependencies to the container
COPY package*.json ./

#installing all the dependencies that we copied 
RUN npm install --silent


#copying all the files inside the container
COPY . .

#exposing the port so we can access it further
EXPOSE 3001

#starting the server
CMD ["node", "index.js"]