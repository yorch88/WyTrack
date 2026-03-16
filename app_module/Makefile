PROJECT_NAME = wytrack
COMPOSE = docker compose

SERVICE_FRONTEND = frontend
SERVICE_BACKEND = backend
SERVICE_MONGO = mongo
SERVICE_REDIS = redis


.PHONY: help up down restart build logs ps \
        shell-frontend shell-backend shell-mongo shell-redis \
        restart-frontend restart-backend \
        logs-frontend logs-backend logs-mongo logs-redis \
        npm-install npm-ci rebuild-backend rebuild-frontend


help:
	@echo ""
	@echo "📦 $(PROJECT_NAME) — comandos disponibles"
	@echo ""
	@echo "▶️  Arranque / parada"
	@echo "  make up                 - Levanta todos los contenedores"
	@echo "  make down               - Detiene contenedores"
	@echo "  make restart            - Reinicia todo"
	@echo "  make ps                 - Lista contenedores"
	@echo ""
	@echo "🔁 Reconstrucción"
	@echo "  make build              - Reconstruye todas las imágenes"
	@echo "  make rebuild-frontend   - Reconstruye solo frontend"
	@echo "  make rebuild-backend    - Reconstruye solo backend"
	@echo ""
	@echo "📜 Logs"
	@echo "  make logs               - Logs de todos"
	@echo "  make logs-frontend      - Logs del frontend"
	@echo "  make logs-backend       - Logs del backend"
	@echo "  make logs-mongo         - Logs de mongo"
	@echo "  make logs-redis         - Logs de redis"
	@echo ""
	@echo "💻 Consolas"
	@echo "  make shell-frontend     - Shell del frontend"
	@echo "  make shell-backend      - Shell del backend"
	@echo "  make shell-mongo        - Mongo shell"
	@echo "  make shell-redis        - redis-cli"
	@echo ""
	@echo "🎯 Servicios (reinicio rápido)"
	@echo "  make restart-frontend"
	@echo "  make restart-backend"
	@echo ""
	@echo "📦 NPM utilidades"
	@echo "  make npm-install        - npm install dentro del contenedor"
	@echo "  make npm-ci             - npm ci dentro del contenedor"
	@echo ""


up:
	$(COMPOSE) up -d

start:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down


restart: down up


ps:
	$(COMPOSE) ps


build:
	$(COMPOSE) build


rebuild-frontend:
	$(COMPOSE) build $(SERVICE_FRONTEND)


rebuild-backend:
	$(COMPOSE) build $(SERVICE_BACKEND)


logs:
	$(COMPOSE) logs -f


logs-frontend:
	$(COMPOSE) logs -f $(SERVICE_FRONTEND)


logs-backend:
	$(COMPOSE) logs -f $(SERVICE_BACKEND)


logs-mongo:
	$(COMPOSE) logs -f $(SERVICE_MONGO)


logs-redis:
	$(COMPOSE) logs -f $(SERVICE_REDIS)


shell-frontend:
	$(COMPOSE) exec $(SERVICE_FRONTEND) sh


shell-backend:
	$(COMPOSE) exec $(SERVICE_BACKEND) sh


shell-mongo:
	$(COMPOSE) exec $(SERVICE_MONGO) mongosh -u root -p rootpassword --authenticationDatabase admin


shell-redis:
	$(COMPOSE) exec $(SERVICE_REDIS) redis-cli


restart-frontend:
	$(COMPOSE) restart $(SERVICE_FRONTEND)


restart-backend:
	$(COMPOSE) restart $(SERVICE_BACKEND)


npm-install:
	$(COMPOSE) run --rm $(SERVICE_FRONTEND) npm install


npm-ci:
	$(COMPOSE) run --rm $(SERVICE_FRONTEND) npm ci