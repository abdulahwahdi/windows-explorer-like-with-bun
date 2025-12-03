.PHONY: help up down restart logs clean build setup

help:  
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*? .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*? "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

setup:  
	@echo "📦 Installing backend dependencies..."
	cd packages/backend && bun install
	@echo "📦 Installing frontend dependencies..."
	cd packages/frontend && bun install
	@echo "✅ Setup complete!"

build: 
	@echo "🏗️  Building Docker images..."
	docker-compose build
	@echo "✅ Build complete!"

up:  
	@echo "🚀 Starting services..."
	docker-compose up -d
	@echo "✅ Services started!"
	@echo "🌐 Frontend: http://localhost:5173"
	@echo "🔌 Backend: http://localhost:3000"
	@echo "🗄️  Database: localhost:5432"

down:  
	@echo "🛑 Stopping services..."
	docker-compose down
	@echo "✅ Services stopped!"

restart: down up 

logs:  
	docker-compose logs -f

logs-backend:  
	docker-compose logs -f backend

logs-frontend:  
	docker-compose logs -f frontend

logs-db:  
	docker-compose logs -f postgres

clean:  
	@echo "🧹 Cleaning up..."
	docker-compose down -v
	docker system prune -f
	@echo "✅ Cleanup complete!"

db-reset:
	@echo "⚠️  Resetting database..."
	docker-compose exec backend bunx prisma migrate reset --force
	@echo "✅ Database reset complete!"

db-seed:  
	@echo "🌱 Seeding database..."
	docker-compose exec backend bun run db:seed
	@echo "✅ Database seeded!"

db-studio:  
	@echo "🎨 Opening Prisma Studio..."
	cd packages/backend && bunx prisma studio

shell-backend:  
	docker-compose exec backend sh

shell-frontend: 
	docker-compose exec frontend sh

shell-db:
	docker-compose exec postgres psql -U postgres -d windows_explorer