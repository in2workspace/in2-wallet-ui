#################
# Build the app #
#################
FROM node:22.11.0 AS build-stage

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --force --ignore-scripts
COPY src src
COPY customAssets customAssets
COPY customTheme customTheme
COPY angular.json angular.json
COPY ionic.config.json ionic.config.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.app.json tsconfig.app.json
COPY tsconfig.spec.json tsconfig.spec.json
RUN npm install -g --ignore-scripts @angular/cli 
RUN ng build --configuration production --output-path=/dist

################
# Run in NGINX #
################
FROM  nginxinc/nginx-unprivileged:stable-alpine
COPY /nginx-custom.conf /etc/nginx/conf.d/default.conf


COPY --from=build-stage /dist /usr/share/nginx/html

USER root
RUN chmod -R 754 /usr/share/nginx/html/assets/env.js
RUN chown nginx:nginx /usr/share/nginx/html/assets/env.js
#RUN chmod -R 777 /usr/share/nginx/html/assets/env.js
USER nginx
# When the container starts, replace the env.js with values from environment variables
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
