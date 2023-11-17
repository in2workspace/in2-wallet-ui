FROM node:19.5.0-alpine as build
WORKDIR /app
COPY . /app/
RUN npm install -g @angular/cli --force
RUN npm i --force
RUN npm run build

FROM nginx
COPY --from=build /app/www/ /usr/share/nginx/html
COPY /docker-entrypoint.sh /
COPY /nginx-custom.conf /etc/nginx/conf.d/default.conf
RUN chmod +x /docker-entrypoint.sh
EXPOSE 8088
ENTRYPOINT [ "/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]