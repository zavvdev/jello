dev:
	npm run dev

prod:
	npm run prod

analyze:
	npm run analyze

prettify:
	npm run prettify

db-up:
	docker compose up -d

db-setup:
	node -r dotenv/config ./scripts/database/setup.js dotenv_config_path=.env

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
