# 🗂️ Windows Explorer - Full Stack File Management System

A modern, production-ready file explorer application built with Vue 3, Elysia, and PostgreSQL. Features a clean architecture with full CRUD operations, search functionality, and Docker support.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Vue](https://img.shields.io/badge/Vue-3.4-green)
![Bun](https://img.shields.io/badge/Bun-1.0-orange)

## ✨ Features

### Core Functionality
- 📁 **Hierarchical Folder Structure** - Unlimited nested folders with tree view
- 📄 **File Management** - Support for files with metadata (size, MIME type)
- 🔍 **Search** - Real-time search across files and folders
- ➕ **Create** - Add new files and folders anywhere in the tree
- ✏️ **Update** - Rename files and folders with inline editing
- 🗑️ **Delete** - Remove files and folders (cascade delete for folders)
- 🖱️ **Context Menu** - Right-click to access quick actions

### Technical Features
- 🏗️ **Clean Architecture** - Hexagonal/Clean Architecture with clear separation
- 🔄 **SOLID Principles** - Well-structured, maintainable codebase
- 🎯 **Type-Safe** - Full TypeScript implementation
- 🧪 **Tested** - Unit and integration tests included
- 🐳 **Docker Ready** - One-command deployment with Docker Compose
- 📊 **Scalable** - Optimized database indexes and pagination support
- 🎨 **Modern UI** - Responsive design with Vue 3 Composition API

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd windows-explorer

# Start everything with one command
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend:  http://localhost:3000
# Database: localhost:5432
```

That's it! The application is now running with a seeded database.

### Manual Setup

#### Prerequisites
- [Bun](https://bun.sh) >= 1.0
- [PostgreSQL](https://www.postgresql.org/) >= 16
- [Node.js](https://nodejs.org/) >= 18 (optional, Bun is preferred)

#### Backend Setup

```bash
# Navigate to backend
cd packages/backend

# Install dependencies
bun install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Setup database
bun run db:generate
bun run db:migrate
bun run db:seed

# Start development server
bun run dev
```

#### Frontend Setup

```bash
# Navigate to frontend
cd packages/frontend

# Install dependencies
bun install

# Configure environment
cp .env.example .env

# Start development server
bun run dev
```

## 📁 Project Structure

```
windows-explorer/
├── packages/
│   ├── backend/                    # Backend API (Elysia + Bun)
│   │   ├── src/
│   │   │   ├── domain/            # Business entities & interfaces
│   │   │   │   ├── entities/
│   │   │   │   └── repositories/
│   │   │   ├── application/       # Use cases & services
│   │   │   │   └── services/
│   │   │   ├── infrastructure/    # External services & DB
│   │   │   │   ├── database/
│   │   │   │   └── repositories/
│   │   │   ├── presentation/      # Controllers & routes
│   │   │   │   └── controllers/
│   │   │   └── index.ts
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   ├── Dockerfile
│   │   └── package.json
│   └── frontend/                   # Frontend App (Vue 3)
│       ├── src/
│       │   ├── components/        # Vue components
│       │   │   ├── icons/
│       │   │   ├── FolderTree.vue
│       │   │   ├── FileList.vue
│       │   │   └── ...
│       │   ├── composables/       # Vue composables
│       │   ├── services/          # API services
│       │   ├── types/             # TypeScript types
│       │   ├── styles/            # Global styles
│       │   ├── App.vue
│       │   └── main.ts
│       ├── Dockerfile
│       └── package.json
├── docker-compose.yml
└── README.md
```

## 🏗️ Architecture

### Backend Architecture

**Clean Architecture Layers:**

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (Controllers, Routes, DTOs)          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Application Layer               │
│    (Use Cases, Business Logic)          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           Domain Layer                  │
│    (Entities, Interfaces)               │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       Infrastructure Layer              │
│    (Database, External Services)        │
└─────────────────────────────────────────┘
```

**Key Design Patterns:**
- Repository Pattern
- Dependency Injection
- Service Layer Pattern
- SOLID Principles

### Frontend Architecture

**Vue 3 Composition API Structure:**
- **Components**: Reusable UI components
- **Composables**: Reusable reactive logic
- **Services**: API communication layer
- **Types**: TypeScript interfaces

## 🔌 API Endpoints

### File System Operations

```
GET    /api/v1/health                     # Health check
GET    /api/v1/nodes                      # Get all nodes
GET    /api/v1/folders/tree               # Get folder tree
GET    /api/v1/nodes/:id                  # Get node by ID
GET    /api/v1/nodes/:id/children         # Get children (paginated)
GET    /api/v1/search?q=query             # Search nodes
POST   /api/v1/nodes                      # Create node
PUT    /api/v1/nodes/:id                  # Update node
DELETE /api/v1/nodes/:id                  # Delete node
```

### Example API Calls

**Create a folder:**
```bash
curl -X POST http://localhost:3000/api/v1/nodes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Folder",
    "type": "FOLDER",
    "parentId": null
  }'
```

**Search files:**
```bash
curl http://localhost:3000/api/v1/search?q=report
```

## 🗄️ Database Schema

```sql
-- File System Nodes
CREATE TABLE file_system_nodes (
  id          UUID PRIMARY KEY,
  name        VARCHAR NOT NULL,
  type        ENUM('FILE', 'FOLDER'),
  parent_id   UUID REFERENCES file_system_nodes(id) ON DELETE CASCADE,
  size        BIGINT,
  mime_type   VARCHAR,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_parent_id ON file_system_nodes(parent_id);
CREATE INDEX idx_name ON file_system_nodes(name);
CREATE INDEX idx_type ON file_system_nodes(type);
CREATE INDEX idx_parent_type ON file_system_nodes(parent_id, type);
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild images
docker-compose build --no-cache

# Restart services
docker-compose restart

# Remove everything (including volumes)
docker-compose down -v

# Check service status
docker-compose ps
```

## 🛠️ Development

### Backend Development

```bash
cd packages/backend

# Start with hot reload
bun run dev

# Run tests
bun run test
bun run test:unit
bun run test:integration

# Database management
bun run db:studio          # Open Prisma Studio
bun run db:migrate         # Create migration
bun run db:seed            # Seed database
bun run db:reset           # Reset database

# Generate Prisma Client
bun run db:generate
```

### Frontend Development

```bash
cd packages/frontend

# Start with hot reload
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview

# Run tests
bun run test
bun run test:ui            # UI mode
bun run test:coverage      # With coverage
```

## 🧪 Testing

### Backend Tests

```bash
cd packages/backend

# Run all tests
bun test

# Run unit tests only
bun test src/**/*.test.ts

# Run integration tests only
bun test src/**/*.integration.test.ts
```

### Frontend Tests

```bash
cd packages/frontend

# Run tests
bun test

# Run with UI
bun test:ui

# Generate coverage report
bun test:coverage
```

## 🚢 Production Deployment

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL="postgresql://user:password@host:5432/db"
NODE_ENV="production"
PORT="3000"
```

**Frontend (.env):**
```env
VITE_API_URL="https://api.yourdomain.com"
```

### Docker Production Build

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Production Deployment

**Backend:**
```bash
cd packages/backend
bun install --production
bunx prisma generate
bunx prisma migrate deploy
bun run start
```

**Frontend:**
```bash
cd packages/frontend
bun install
bun run build
# Serve the dist/ folder with nginx or similar
```

## 📝 Code Style

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Conventional Commits** for commit messages

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change port in .env and docker-compose.yml
```

**Database connection failed:**
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

**Prisma Client errors:**
```bash
# Regenerate Prisma Client
cd packages/backend
bunx prisma generate

# Reset database
bunx prisma migrate reset
```

**Docker build fails:**
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

## 📚 Tech Stack

### Backend
- **Runtime**: [Bun](https://bun.sh) 1.0
- **Framework**: [Elysia](https://elysiajs.com) 1.0
- **Database**: [PostgreSQL](https://www.postgresql.org/) 16
- **ORM**: [Prisma](https://www.prisma.io/) 5.7
- **Language**: TypeScript 5.3

### Frontend
- **Framework**: [Vue 3](https://vuejs.org/) 3.4
- **Build Tool**: [Vite](https://vitejs.dev/) 5.0
- **HTTP Client**: [Axios](https://axios-http.com/) 1.6
- **Language**: TypeScript 5.3

### DevOps
- **Container**: [Docker](https://www.docker.com/) & Docker Compose
- **Database GUI**: Prisma Studio

## 👥 Authors

- Abdulah Wahdi

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Prisma team for the excellent ORM
- Bun team for the blazing fast runtime
- Elysia team for the elegant web framework

## 📞 Support

For support, email abdulah.wahdi@gmail.com or open an issue on GitHub.

---

**Built with ❤️ using Vue 3, Elysia, and Bun**