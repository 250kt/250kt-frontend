FROM nginx:alpine
COPY ./dist/250kt-cs ./usr/share/nginx/html
