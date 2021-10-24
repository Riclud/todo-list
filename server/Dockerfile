FROM node 

WORKDIR /usr/app/server

COPY package*.json ./

RUN npm install -g --force yarn 
RUN npm install -g --force @nestjs/cli

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 8000

CMD node dist/main

