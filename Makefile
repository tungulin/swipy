include .env
export 

export PROJECT_ROOT=$(shell pwd)


env-up: 
	docker compose up -d swipy-postgres

env-down: 
	docker compose down swipy-postgres

env-cleanup: 
	docker compose down swipy-postgres && \
	rm -rf out/pgdata

env-port-forward:
	@docker compose up -d port-forwarder
	
env-port-close:
	@docker compose down port-forwarder

migrate-create: 
	docker compose run --rm swipy-migrate \
		create \
		-ext sql \
		-dir /migrations \
		-seq "$(seq)"

migrate-up: 
	make migrate-action=up
	
migrate-down: 
	make migrate-action=down 

migrate-action: 
	docker compose run --rm swipy-migrate \
		-path /migrations \
		-database postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@swipy-postgres:5432/${POSTGRES_DB}??sslmode=disable \
		"${action}"

 swipy-run: 
	@export LOGGER_FOLDER=${PROJECT_ROOT}/out/logs && \
	go mod tidy && \
	go run cmd/swipy/main.go