# Introduction 
IN2 Wallet Front is the presentation side application for the IN2 Wallet project. It is a Ionic Angular application. 

## Architecture
The application is based on the following architecture:
### Wallet Driving Application (WDA)

## Main Features
// TODO: Add the main features of the application
- User registration
- User login
- User logout
- User QR Scaning
- User DID management
- User Verifiable Credentials management
- User Prefered Language management
- User Prefered Scaning Camera management

# Getting Started
This aplication is developed, builded and tested in Visual Studio Code 
1. Clone the repository:
```git clone https://in2Dome@dev.azure.com/in2Dome/DOME/_git/in2-dome-wallet_frontend```
2. Install dependencies:
```npm install```
3. Install Ionic
```npm install -g @ionic/cli```
# Build and Test
We have 3 different ways to build and test the project depending on the selected Spring Boot profile.
- `test` profile: This profile is used for unit testing. It uses an in-memory database and does not require any external dependencies.
- `local` profile: This profile is used for local development. It uses an in-memory database and generates default data to test the application. You need to run a set of docker containers to run the application (Orion Context Broker and MongoDb).
- `local-docker` profile: This profile is used for local development. It uses a dockerized database and generates default data to test the application.
- `dev` profile: This profile is used for development. It uses a dockerized database and generates default data to test the application.

# Contribute

# License

# Documentation