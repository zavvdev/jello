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

6. Run `make db-migrate`

7. Run either `make dev` to run app in dev mode or `make prod` to run in production mode.

## Scripts

`make dev` - run application in development mode

`make prod` - run application in production mode

`make analyze` - run application static analysis

`make prettify` - apply prettier to files

`make migration name=<name>` - generate migration file

`make db-up` - create a database container from image

`make db-setup` - execute initial database migrations

`make db-migrate` - execute database migrations

`make db-stop` - stop database container

`make db-start` - start stopped database container

`make db-down` - shutdown database container and remove all related data

`make db-exec id=container-id` - get access to container command line

`make db-sc` - show running containers

## Data flow

1. Next.js api routes responsible for accepting data from user, making any transformations related to Next.js ecosystem (for example, extrac token from cookies etc) and calling controllers from `core/gateway`.

2. Controllers responsible for Authentication and Validation. Then they should delegate execution to processes from `core/domain`.

3. Processes are functions that perform domain business logic. Responsible for Authorization and communication with repositories from `core/infrastructure`.

4. Repositories are responsible for db CRUD operations.

## Result value rules

1. If any process from `core/domain` needs to return something, it should be wrapper into `Result`.

2. If any controller from `core/gateway` needs to return something, it should be wrapper into `Result`.

3. If process has no return value, you can omit Result and return an empty Either.

## Repositories

Repositories are needed for database CRUD operations. Do not write complex logic there. Move it into processes instead.

Each repository method is obligated to use its local `#client` for making database queries. Do not use `db` directly inside repository methods because in this case when you need to perform a transaction from processes, your method won't inherit `client` that is needed for this transaction.
