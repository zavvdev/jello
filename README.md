# Jello

## Prerequisites

- Install Make

- Install Node.js

- Install Docker

## Setup

1. Create `.env` file from `.env.example` and fill database variables

2. Make sure your Node.js version matches that one from `.nvmrc` file

3. Run `npm install`

4. Run `make db-up`

5. Run `make db-setup`

6. Run either `make dev` to run app in dev mode or `make prod` to run in production mode.

## Scripts

`make dev` - run application in development mode

`make prod` - run application in production mode

`make analyze` - run application static analysis

`make prettify` - apply prettier to files

`make db-up` - create a database container from image

`make db-setup` - execute initial database migrations

`make db-stop` - stop database container

`make db-start` - start stopped database container

`make db-down` - shutdown database container and remove all related data

`make db-exec id=container-id` - get access to container command line

`make db-sc` - show running containers
