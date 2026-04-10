# Aries Ventures — Platform

**Live**: https://aris-ventures.com | **API**: https://api.aris-ventures.com

Full-stack web agency platform. Angular 17 frontend + Django 5 backend, upgraded to production-grade with normalised PostgreSQL schema, Django Channels WebSockets, JWT auth with rotating tokens, Resend emails, Upstash rate limiting, and Trigger.dev background jobs.

---

## Architecture

```
aries-ventures/
├── apps/
│   ├── web/          # Angular 17 SPA (Vercel)
│   └── api/          # Django 5 + DRF + Channels (Oracle Cloud / ASGI)
├── e2e/              # Playwright E2E tests
├── .github/workflows/
│   ├── ci.yml        # Lint + test on PR
│   └── deploy.yml    # Deploy on merge to main
└── .env.example      # All required environment variables
```

---

## Local Setup

### Prerequisites
- Node.js 20+, npm
- Python 3.11+
- PostgreSQL 16
- Redis (for Django Channels + rate limiting)

### 1. Clone and install

```bash
git clone https://github.com/abdsayeed/AV_web.git
cd AV_web
cp .env.example .env   # fill in your values
```

### 2. Backend

```bash
cd apps/api
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements/dev.txt

# Create the database
createdb aries_ventures

# Run migrations
python manage.py migrate

# Seed lookup data (industries, templates, pricing plans)
python manage.py seed_db

# Start ASGI dev server (supports WebSockets)
uvicorn config.asgi:application --reload --port 8000
```

### 3. Frontend

```bash
cd frontend   # or apps/web
npm install
npm start     # → http://localhost:4200
```

### 4. E2E tests

```bash
cd e2e
npm install
npx playwright install chromium
npx playwright test
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in every value. Key variables:

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django 50-char secret key |
| `DB_*` | PostgreSQL connection details |
| `SOCIAL_AUTH_GOOGLE_OAUTH2_KEY` | Google OAuth client ID |
| `SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET` | Google OAuth client secret |
| `RESEND_API_KEY` | Resend API key (use `re_...`) |
| `RESEND_FROM_EMAIL` | Sender address (`onboarding@resend.dev` for dev) |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
| `TRIGGER_API_KEY` | Trigger.dev API key for background jobs |
| `SENTRY_DSN` | Sentry DSN for error tracking |
| `REDIS_URL` | Redis URL for Django Channels (`redis://localhost:6379`) |

### Google OAuth Setup
1. Go to https://console.cloud.google.com → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add authorised redirect URIs:
   - Local: `http://localhost:8000/auth/complete/google-oauth2/`
   - Production: `https://api.aris-ventures.com/auth/complete/google-oauth2/`
4. Copy Client ID → `SOCIAL_AUTH_GOOGLE_OAUTH2_KEY`
5. Copy Client Secret → `SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET`

---

## Database

### PostgreSQL 12 → 16 Upgrade Path

**Option A — pg_upgrade (in-place, fastest):**
```bash
# On Oracle VM
sudo systemctl stop aries-backend
sudo pg_upgradecluster 12 main   # Ubuntu pg_upgradecluster handles this
sudo systemctl start postgresql
python manage.py migrate
```

**Option B — dump and restore (safest):**
```bash
# On Oracle VM
pg_dump -U aries_user aries_ventures > backup_pg12.sql
sudo apt install postgresql-16
sudo -u postgres createuser aries_user
sudo -u postgres createdb aries_ventures -O aries_user
psql -U aries_user aries_ventures < backup_pg12.sql
python manage.py migrate
```

The Django schema is forward-compatible with both PostgreSQL 12 and 16 during the transition window.

### Seed the database
```bash
python manage.py seed_db
```
Populates: 6 industries, 7 templates with features, 3 pricing plans.

---

## ASGI Deployment (Django Channels)

The backend now uses ASGI (uvicorn/daphne) instead of WSGI (gunicorn) to support WebSocket connections.

**Update systemd service on Oracle VM:**
```bash
sudo nano /etc/systemd/system/aries-backend.service
```

Change `ExecStart` to:
```ini
ExecStart=/home/ubuntu/AV_web/apps/api/venv/bin/uvicorn config.asgi:application \
  --host 0.0.0.0 --port 8000 --workers 2
```

```bash
sudo systemctl daemon-reload
sudo systemctl restart aries-backend
```

**Update Nginx** to proxy WebSocket connections:
```nginx
location /ws/ {
    proxy_pass http://127.0.0.1:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 86400;
}
```

---

## Running Tests

### Backend (pytest)
```bash
cd apps/api
source venv/bin/activate
pytest
```

### Frontend (Karma + Jasmine)
```bash
cd frontend
npm test -- --watch=false --browsers=ChromeHeadless
```

### E2E (Playwright)
```bash
cd e2e
npx playwright test
npx playwright show-report   # view HTML report
```

---

## Deployment

### Frontend → Vercel (automatic)
Push to `main` → Vercel auto-deploys. Manual: `vercel --prod` from `frontend/`.

### Backend → Oracle Cloud (SSH)
```bash
ssh -i ~/Downloads/ssh-key-2026-04-06.key ubuntu@193.123.178.104
cd /home/ubuntu/AV_web
git pull origin main
cd apps/api
source venv/bin/activate
pip install -r requirements/base.txt -q
python manage.py migrate --noinput
python manage.py collectstatic --noinput
sudo systemctl restart aries-backend
```

### GitHub Actions Secrets Required
Add these in GitHub → Settings → Secrets:

| Secret | Value |
|---|---|
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Vercel org ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `ORACLE_HOST` | `193.123.178.104` |
| `ORACLE_SSH_KEY` | Contents of `ssh-key-2026-04-06.key` |

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register/` | Public | Register, returns JWT tokens |
| POST | `/api/auth/login/` | Public | Login, returns JWT tokens |
| POST | `/api/auth/token/refresh/` | Public | Rotate refresh token |
| GET/PATCH | `/api/auth/profile/` | Required | Get/update profile |
| POST | `/api/auth/forgot-password/` | Public | Send reset email |
| POST | `/api/auth/reset-password/` | Public | Reset with token |
| POST | `/api/auth/change-password/` | Required | Change password |
| GET | `/api/auth/verify-email/` | Public | Verify email token |
| GET | `/api/industries/` | Public | List industries (cached 1h) |
| GET | `/api/templates/` | Public | List templates (cached 1h) |
| GET | `/api/templates/<slug>/` | Public | Template detail |
| GET | `/api/pricing/plans/` | Public | List pricing plans (cached 1h) |
| GET | `/api/pricing/plans/<slug>/` | Public | Plan detail |
| POST | `/api/contact/submit/` | Public | Submit lead form (rate limited: 3/hr) |
| GET | `/api/contact/lookup/` | Public | Lookup by reference number |
| GET | `/api/projects/` | Required | List user's projects |
| GET | `/api/projects/<id>/` | Required | Project detail + history + files |
| GET/POST | `/api/projects/<id>/messages/` | Required | Project messages |
| PATCH | `/api/messages/<id>/read/` | Required | Mark message read |
| GET | `/api/notifications/` | Required | List notifications + unread count |
| PATCH | `/api/notifications/<id>/read/` | Required | Mark notification read |
| POST | `/api/analytics/event/` | Public | Track analytics event |
| GET | `/api/admin/analytics/` | Admin | Analytics dashboard data |
| GET | `/api/health/` | Public | Health check |

**WebSocket endpoints:**
- `ws://<host>/ws/notifications/?token=<access_token>` — personal notification stream
- `ws://<host>/ws/projects/<id>/messages/?token=<access_token>` — project message thread

---

## Architecture Decisions

**Why keep Angular 17 + Django instead of Next.js?** The existing codebase is production-deployed and working. A full rewrite would take months and introduce regression risk. The upgrade path (normalised schema, ASGI, rotating JWT, Channels) delivers all the production-grade features without a framework migration.

**Why ASGI/uvicorn instead of gunicorn?** Django Channels requires ASGI for WebSocket support. Uvicorn with 2 workers handles the same HTTP load as gunicorn while adding WebSocket capability.

**Why Upstash Redis for rate limiting instead of Django's built-in?** Upstash is serverless and doesn't require a persistent Redis connection — it works via HTTP REST calls, which is simpler to operate on Oracle's free tier VM.

**Why Trigger.dev for background jobs?** Email sending and analytics aggregation should never block the HTTP response. Trigger.dev's HTTP trigger pattern lets Django fire-and-forget with automatic retries, without needing a Celery worker process.

**Why store prices in pence (integer)?** Floating-point arithmetic is unreliable for money. £59.00 stored as `5900` pence eliminates rounding errors entirely.

---

## Team

| Name | Role | Email |
|---|---|---|
| Abdullah Al Sayeed | Backend Developer | abdsayeedofficial@gmail.com |
| MD Nasif | Frontend Developer | Mdnasif17@gmail.com |
| AR Fahad | DevOps Engineer | mdarfahad@gmail.com |

---

## Quick Reference

| Item | Value |
|---|---|
| Live site | https://aris-ventures.com |
| API | https://api.aris-ventures.com/api |
| Admin | https://api.aris-ventures.com/admin/ |
| Oracle IP | 193.123.178.104 |
| SSH key | `~/Downloads/ssh-key-2026-04-06.key` |
| GitHub | https://github.com/abdsayeed/AV_web |
