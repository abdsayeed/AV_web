# Aries Ventures - Professional Web Services

A modern, full-stack web application with Angular frontend and Node.js backend.

## Project Structure

```
aries-ventures/
├── frontend/                     # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   └── ...
│   ├── angular.json
│   ├── package.json
│   └── ...
├── backend/                      # Node.js backend API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── ...
│   ├── package.json
│   └── ...
├── Documentation/                # All documentation files
│   ├── README.md
│   ├── SETUP.md
│   ├── DEPLOYMENT.md
│   └── ...
└── docker-compose.yml           # Docker configuration for full stack
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (for backend)

## Quick Start

### Development (Both Frontend & Backend)

1. **Clone and setup:**
```bash
git clone <repository-url>
cd aries-ventures
```

2. **Install dependencies for both frontend and backend:**
```bash
# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

3. **Start development servers:**
```bash
# Start both frontend and backend concurrently
npm run dev

# Or start them separately:
npm run dev:frontend    # Starts Angular dev server on http://localhost:4200
npm run dev:backend     # Starts Node.js API server on http://localhost:3000
```

### Frontend Only Development

```bash
cd frontend
npm install
npm start
```
Navigate to `http://localhost:4200/`

### Backend Only Development

```bash
cd backend
npm install
npm run dev
```
API available at `http://localhost:3000/api`

## Build Commands

### Production Build

```bash
# Build both frontend and backend
npm run build

# Build frontend only
npm run build:frontend

# Build backend only
npm run build:backend
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

## Environment Setup

### Frontend Environment
Create `frontend/.env`:
```
NG_APP_API_URL=http://localhost:3000/api
NG_APP_ENVIRONMENT=development
```

### Backend Environment
Create `backend/.env`:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/aries-ventures
JWT_SECRET=your-jwt-secret-key
```

## Available Scripts

### Root Level Commands
- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only frontend development server
- `npm run dev:backend` - Start only backend development server
- `npm run build` - Build both applications for production
- `npm run build:frontend` - Build frontend for production
- `npm run build:backend` - Build backend for production
- `npm run test` - Run tests for both applications
- `npm run lint` - Lint both applications

### Frontend Commands (run from /frontend)
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run e2e` - Run end-to-end tests
- `npm run lint` - Lint TypeScript code

### Backend Commands (run from /backend)
- `npm run dev` - Start development server with nodemon
- `npm run start` - Start production server
- `npm run build` - Build TypeScript to JavaScript
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint TypeScript code

## Features

### Frontend (Angular)
- ✨ Single-page application with smooth scroll navigation
- 🎨 Modern, professional design with dark mode support
- 📱 Fully responsive (mobile, tablet, desktop)
- 🚀 Fast and optimized
- 🎯 7 main sections: Home, How It Works, Services, Clients, Templates, Team, Contact
- 🌙 Dark/Light mode toggle
- 📋 Contact form with validation

### Backend (Node.js/Express)
- 🔐 JWT Authentication
- 📊 RESTful API
- 🗄️ MongoDB integration
- 📧 Email service integration
- 🛡️ Security middleware
- 📝 Request logging
- ✅ Input validation

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get contact submissions (admin)

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service (admin)
- `PUT /api/services/:id` - Update service (admin)
- `DELETE /api/services/:id` - Delete service (admin)

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  role: String (user/admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Contact Submissions Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  company: String,
  message: String,
  services: [String],
  budget: String,
  status: String (new/contacted/closed),
  createdAt: Date
}
```

## Deployment

### Production Deployment
1. Build both applications
2. Set production environment variables
3. Deploy to your hosting platform

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2024 Aries Ventures. All rights reserved.

## Support

For support, email info@ariesventures.com