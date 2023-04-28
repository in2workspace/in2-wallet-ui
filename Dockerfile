# Base image
FROM node:14-alpine
# Create app directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install -g @angular/cli
RUN npm install --save-dev @angular-devkit/build-angular
RUN npm i
# Copy app source
COPY . .
# Build the app
# Expose port 80
EXPOSE 4203
# Start the app
CMD ["ng", "serve", "--host", "0.0.0.0", "--disable-host-check", "true", "--port", "4203", "-c", "prod"]
