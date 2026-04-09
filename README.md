# Aries Ventures - Professional Web Services

A modern, full-stack web application with an Angular frontend and a Django REST API backend.

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
├── backend/                      # Django REST API backend
│   ├── apps/
│   ├── config/
│   ├── requirements/
│   ├── manage.py
│   └── ...
├── Documentation/                # All documentation files
│   ├── SETUP.md
│   ├── DEPLOYMENT.md
│   └── ...
└── docker-compose.yml           # Docker configuration for full stack
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Python (v3.11 or higher)
- PostgreSQL (for backend database)
- Redis (for Celery worker and caching)

## Quick Start

### 1. Backend Setup (Django)

```bash
cd backend
# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements/development.txt

# Copy environment file
cp .env.example .env
# Edit .env with your settings (e.g. database credentials)

# Run migrations
python manage.py migrate

# Start Django server
python manage.py runserver
```

### 2. Frontend Setup (Angular)

Open a new terminal window:
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```
Navigate to `http://localhost:4200/`

## Deployment

### Docker Deployments

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

For production deployments, please refer to the `Documentation/DEPLOYMENT.md` guide.

## Features

### Frontend (Angular)
- ✨ Single-page application with smooth scroll navigation
- 🎨 Modern, professional design with TailwindCSS support
- 📱 Fully responsive (mobile, tablet, desktop)
- 🚀 Fast and optimized
- 🌙 Dark/Light mode toggle
- 📋 Contact form with validation

### Backend (Django REST Framework)
- 🔐 JWT Authentication
- 📊 RESTful APIs
- 🗄️ PostgreSQL database integration
- 📧 Email notifications via Resend
- 📝 Admin dashboard for easy management
- ✅ Input validation and rate limiting
- 📋 Celery task queue and Redis caching

## Documentation

For detailed setup and usage instructions, see the Documentation folder:

- [Setup Guide](Documentation/SETUP.md) - Complete setup instructions
- [API Documentation](Documentation/API.md) - API endpoints and usage
- [Deployment Guide](Documentation/DEPLOYMENT.md) - Production deployment
- Backend-specific notes are available in `backend/README.md`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2024-2026 Aries Ventures. All rights reserved.

## Support

For support, email info@ariesventures.com
