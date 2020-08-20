FROM node:lts
# Create app directory
WORKDIR /app

COPY . .
COPY ./package.json ./

RUN npm install

EXPOSE 33001

CMD [ "node", "index.js" ]
