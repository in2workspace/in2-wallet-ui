# build image
FROM node:19.5.0-alpine
RUN addgroup -S nonroot && adduser -S nonroot -G nonroot
WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli && npm install
COPY . .
EXPOSE 4200
USER nonroot
CMD ["sh", "-c", "ng serve --host 0.0.0.0 --disable-host-check true --port 4200 -c ${ENVIRONMENT}"]
