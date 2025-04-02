FROM node:20-alpine as build

WORKDIR /app/client

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.26

COPY --from=build /app/client/build /usr/share/nginx/html