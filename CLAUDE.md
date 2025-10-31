# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack portfolio application with three main services:
- **portfolio-frontend**: React + TypeScript + Vite + TailwindCSS frontend
- **portfolio-backend**: Node.js + Express + Prisma backend with PostgreSQL
- **portfolio-clip-service**: Python FastAPI service for CLIP-based image embeddings and semantic search

All services are orchestrated via Docker Compose with PostgreSQL (pgvector extension) and Redis.

## Development Commands

### Frontend (portfolio-frontend)
```bash
cd portfolio-frontend
npm run dev          # Start Vite dev server on port 5174
npm run build        # TypeScript compile + Vite build
npm run lint         # ESLint
npm run preview      # Preview production build
```

### Backend (portfolio-backend)
```bash
cd portfolio-backend
npm run dev          # Start nodemon with ts-node on port 3001
npm run build        # Compile TypeScript to dist/
npm start            # Run compiled JavaScript from dist/
npx prisma migrate dev     # Run database migrations
npx prisma generate        # Generate Prisma client
npx prisma studio          # Open Prisma Studio
```

### CLIP Service (portfolio-clip-service)
```bash
cd portfolio-clip-service
python run_dev.py    # Start FastAPI dev server on port 8000
# API docs available at http://localhost:8000/docs
```

### Docker
```bash
docker-compose up -d            # Start all services
docker-compose up -d postgres   # Start only database
docker-compose logs -f backend  # Follow backend logs
docker-compose down             # Stop all services
```

## Architecture

### Data Flow
1. Frontend (React) communicates with Backend via REST API
2. Backend uses Prisma ORM to interact with PostgreSQL
3. Backend calls CLIP Service for image embedding generation
4. Image embeddings stored as pgvector(512) in PostgreSQL
5. Redis used for caching and queues

### Frontend Structure
- **Atomic Design Pattern**: components organized as atoms/molecules/organisms/features
- **State Management**: Redux Toolkit with slices in `src/store/slices/`
- **Routing**: React Router with protected admin routes
- **Key Pages**: Home (portfolio sections), Login/Register, Dashboard (admin)

### Backend Structure
- **MVC Pattern**: controllers, routes, services, middleware
- **Authentication**: JWT-based with bcrypt password hashing
- **Database**: Prisma ORM with PostgreSQL + pgvector extension
- **API Routes**:
  - `/api/auth` - Authentication (login, register)
  - `/api/images` - Image upload and management
  - `/api/blog` - Blog post CRUD
  - `/api/projects` - Project management
  - `/api/search` - Semantic search using CLIP embeddings

### CLIP Service Structure
- **FastAPI** async API with thread pool executor
- **Endpoints**:
  - `/embed/image` - Generate image embeddings
  - `/embed/text` - Generate text embeddings
  - `/embed/batch` - Batch process multiple images
  - `/similarity` - Calculate cosine similarity
  - `/search` - Semantic search
- **Model**: OpenAI CLIP (clip-vit-base-patch32), 512-dimensional embeddings

### Database Schema (Prisma)
- **User**: Admin users with role-based access
- **Image**: Uploaded images with CLIP embeddings (vector(512))
- **BlogPost**: Blog posts with markdown content
- **Project**: Portfolio projects
- **GithubStats**: Cached GitHub statistics

## Key Technical Details

### Semantic Image Search (Fully Implemented)
The application features a complete semantic image search system using CLIP embeddings:

**Upload Flow:**
1. User uploads image via Dashboard → ImageUpload component
2. Frontend sends multipart/form-data to `/api/images`
3. Backend saves file to `uploads/` directory
4. Backend calls CLIP service to generate 512-dimensional embedding
5. Embedding stored as `vector(512)` in PostgreSQL using pgvector

**Search Flow:**
1. User enters natural language query (e.g., "sunset over mountains")
2. Frontend offers two modes:
   - **Text Search**: SQL ILIKE on title/description fields
   - **Semantic Search**: AI-powered via CLIP embeddings
3. For semantic search:
   - Query sent to CLIP service for text embedding
   - PostgreSQL uses cosine distance operator (`<=>`) to find similar images
   - Results ranked by similarity score (0-100%)
4. Frontend displays images with similarity badges

**Key Endpoints:**
- `GET /api/search/semantic?query=...` - Semantic search by text
- `GET /api/search/text?query=...` - Traditional text search
- `GET /api/search/similar/:id` - Find similar images to a given image
- `POST /api/images` - Upload image with automatic embedding generation

### Environment Variables
Each service has its own `.env` file:
- Backend: `DATABASE_URL`, `REDIS_URL`, `CLIP_SERVICE_URL`, `JWT_SECRET`, `FRONTEND_URL`
- CLIP Service: `MODEL_NAME`, `DEVICE`, `REDIS_HOST`, `CORS_ORIGINS`
- Frontend: `VITE_API_URL`

### Authentication Flow
1. User registers/logs in via `/api/auth` endpoints
2. Backend returns JWT token
3. Frontend stores token and includes in Authorization header
4. Protected routes use `ProtectedRoute` component (frontend) and `auth.middleware` (backend)
5. Admin-only routes check `role === 'ADMIN'`

### TypeScript Configuration
- Frontend uses ESM (`type: "module"` in package.json)
- Backend uses CommonJS (`type: "commonjs"`)
- Both have strict TypeScript configurations
