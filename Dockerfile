#Stage 1
FROM node:17-alpine as builder
WORKDIR /app
COPY package*.json .
COPY yarn*.lock .
RUN yarn install
COPY . .
RUN export NODE_OPTIONS=--openssl-legacy-provider && yarn build

#Stage 2
FROM nginx:1.19.0
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]