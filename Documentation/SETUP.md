# Setup Guide

This guide will help you set up the Aries Ventures full-stack application for development.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)
- Git

## Quick Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd aries-ventures
```

### 2. Install All Dependencies

```bash
npm run install:all
```

This will install dependencies for the root project, frontend, and backend.

### 3. Environment Configuration

#### Backend Environment
Copy the example environment file and configure it:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your configuration:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/aries-ventures
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:4200
```

#### Frontend Environment
Create `frontend/.env`:

```env
NG_APP_API_URL=http://localhost:3000/api
NG_APP_ENVIRONMENT=development
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will create the database automatically

#### Option B: MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Update `MONGODB_URI` in `backend/.env`

#### Option C: Docker MongoDB
```bash
docker run -d --name mongodb -p 27017:27017 mongo:7.0
```

### 5. Start Development Servers

#### Start Both Frontend and Backend
```bash
npm run dev
```

#### Start Individually
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

### 6. Access the Application

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api
- API Health Check: http://localhost:3000/api/health

## Docker Setup (Alternative)

If you prefer using Docker:

### 1. Build and Start with Docker Compose

```bash
docker-compose up --build
```

### 2. Access the Application

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api
- MongoDB: localhost:27017

## Development Workflow

### Making Changes

1. **Frontend Changes**: Edit files in `frontend/src/`
2. **Backend Changes**: Edit files in `backend/src/`
3. Both servers support hot reload

### Running Tests

```bash
# Run all tests
npm run test

# Run frontend tests only
npm run test:frontend

# Run backend tests only
npm run test:backend
```

### Linting

```bash
# Lint all code
npm run lint

# Lint frontend only
npm run lint:frontend

# Lint backend only
npm run lint:backend
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000 (backend)
npx kill-port 3000

# Kill process on port 4200 (frontend)
npx kill-port 4200
```

#### MongoDB Connection Issues
1. Ensure MongoDB is running
2. Check the connection string in `.env`
3. Verify network connectivity

#### Node Modules Issues
```bash
# Clean and reinstall
npm run clean
npm run install:all
```

#### Angular CLI Issues
```bash
# Install Angular CLI globally
npm install -g @angular/cli
```

### Environment Variables Not Loading
1. Ensure `.env` files exist in correct locations
2. Restart the development servers
3. Check for syntax errors in `.env` files

### CORS Issues
1. Verify `FRONTEND_URL` in backend `.env`
2. Check CORS configuration in `backend/src/server.ts`

## Next Steps

1. Review the [API Documentation](API.md)
2. Check out the [Frontend Guide](FRONTEND.md)
3. Read the [Backend Guide](BACKEND.md)
4. See [Deployment Guide](DEPLOYMENT.md) for production setup