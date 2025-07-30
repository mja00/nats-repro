# Really basic dockerfile that just runs the node app
FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

CMD ["npm", "start"]