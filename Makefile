dev:
	npm run dev

prod:
	npm run prod

analyze:
	npm run analyze

prettify:
	npm run prettify

migration:
	node ./scripts/create-migration/runner.js $(name)

db-up:
	docker compose up -d

db-setup:
	node -r dotenv/config ./scripts/database/setup.js dotenv_config_path=.env

db-migrate:
	node -r dotenv/config ./scripts/database/migrate.js dotenv_config_path=.env --filter=$(filter) --rollback=$(rollback)

db-stop:
	docker compose stop

db-start:
	docker compose start

db-down:
	docker compose down --rmi all -v

db-exec:
	docker exec -it $(id) bash

sc:
	docker ps
