# Aries Ventures Backend

Django REST API backend for the Aries Ventures website.

## Quick Start

### 1. Setup Environment

```bash
# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements/development.txt

# Copy environment file
cp .env.example .env
# Edit .env with your settings
```

### 2. Database Setup

```bash
# Create database (PostgreSQL)
createdb aries_ventures

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 3. Run Development Server

```bash
# Start Django server
python manage.py runserver

# Start Celery worker (in another terminal)
celery -A config worker -l info

# Start Celery beat (in another terminal)
celery -A config beat -l info
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile

### Contact Forms
- `POST /api/contact/submit/` - Submit contact form
- `GET /api/contact/lookup/` - Look up submission by reference
- `GET /api/contact/submissions/` - List submissions (admin)
- `GET /api/contact/submissions/{id}/` - Get submission details (admin)

### Templates
- `GET /api/templates/` - List templates
- `GET /api/templates/{slug}/` - Get template details

### Pricing
- `GET /api/pricing/plans/` - List pricing plans
- `GET /api/pricing/plans/{slug}/` - Get plan details

## Environment Variables

See `.env.example` for all available environment variables.

Key variables:
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (True/False)
- `DB_*` - Database configuration
- `RESEND_API_KEY` - Email service API key
- `REDIS_URL` - Redis connection URL

## Deployment

### Production Setup

1. Set up PostgreSQL database
2. Set up Redis server
3. Configure environment variables
4. Run migrations: `python manage.py migrate`
5. Collect static files: `python manage.py collectstatic`
6. Start services with supervisor or systemd

### Docker (Optional)

```bash
# Build image
docker build -t aries-ventures-backend .

# Run container
docker run -p 8000:8000 aries-ventures-backend
```

## Features

- ✅ User authentication with JWT
- ✅ Contact form submissions
- ✅ Email notifications (Resend)
- ✅ Admin dashboard
- ✅ Template management
- ✅ Pricing plan management
- ✅ Analytics tracking
- ✅ File uploads (Cloudinary)
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Celery task queue
- ✅ Redis caching

## Development

### Running Tests

```bash
python manage.py test
```

### Code Quality

```bash
# Format code
black .

# Check imports
isort .

# Lint code
flake8 .
```

### Database

```bash
# Create migration
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Reset database
python manage.py flush
```

## Support

For questions or issues, contact the development team or check the documentation in the `Documentation/` folder.