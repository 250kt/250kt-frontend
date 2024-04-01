FROM nginx:alpine
COPY ./dist/250kt-frontend ./usr/share/nginx/html
