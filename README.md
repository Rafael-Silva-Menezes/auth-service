# Google Cloud Run + NestJS + MongoDB + Keycloak + MySql

## Introduction

This repository implements an authentication service that can be used on any system. Keycloak was used for user authentication and authorization.MySql was chosen as the database for our Keycloak.
Our NestJs API serves as an interface to facilitate authentication and other keycloak processes. In addition to implementing with Mongo and other technologies, simple and easy management of authentication, session and password recovery.

## Setting the local environment

For this project to run locally, it will be necessary to use a system that has the programs below installed.

- Docker
- Docker Compose
- NPM

With all the above requirements fulfilled, start the containerized development environment.
```
npm run start:env
```

In it you will find all the necessary tools for the development of the application, an instance of Mongo will be raised and in addition the Keycloak with MySql will be raised as well. To facilitate the process, in this repository keycloak, mysql and mongoDb are already populated with initial data.

The first time the project is run, use the command below to install the project's dependencies.

```bash
npm install
```

To run in development mode.

```bash
npm run start:dev
```

After this step, carry out the project build process.

```bash
npm run build
```

For other functionality, see the [package.json](package.json) file.

Remembering that this project is not 100% configured for a cloud environment. For local environment only.