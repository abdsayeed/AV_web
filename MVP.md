# MVP — Aries Ventures Platform

**Last Updated**: April 2026
**Status**: Live in Production
**Live URL**: https://aris-ventures.com
**API URL**: https://api.aris-ventures.com

---

## 1. Executive Summary

Aries Ventures is a web agency that builds and manages professional websites for local businesses — barbershops, restaurants, salons, and other SMBs. The platform operates on a subscription model ("Pay-As-You-Go"), a fully managed plan, or a one-time custom build.

The MVP is fully live. It consists of:
- A public-facing Angular SPA hosted on Vercel
- A Django REST API hosted on Oracle Cloud (always-on, free tier)
- A PostgreSQL database on Oracle Cloud
- JWT-based authentication for user accounts
- A multi-step contact/lead capture form
- A live template showcase with real demo links

---

## 2. Infrastructure & Deployment

### Frontend
- **Framework**: Angular 17 (TypeScript)
- **Styling**: Tailwind CSS
- **Hosting**: Vercel (auto-deploys on push to `main`)
- **Domain**: https://aris-ventures.com
- **Build**: `ng build --configuration production`
- **Routing**: SPA routing handled via `vercel.json` rewrites

### Backend
- **Framework**: Django 4.2 + Django REST Framework
- **Language**: Python 3.8
- **Hosting**: Oracle Cloud Free Tier — VM.Standard.E2.1.Micro (Ubuntu 20.04)
- **Server IP**: 193.123.178.104
- **Domain**: https://api.aris-ventures.com
- **Process Manager**: Gunicorn (2 workers) managed by systemd
- **Reverse Proxy**: Nginx
- **SSL**: Let's Encrypt (auto-renews via certbot)
- **Database**: PostgreSQL 12 (local on Oracle VM)
- **Admin Panel**: https://api.aris-ventures.com/admin/

### Git & CI/CD
- **Repository**: https://github.com/abdsayeed/AV_web
- **Main branch**: `main` — triggers Vercel frontend deploy automatically
- **Backend deploy**: manual `git pull` + `systemctl restart aries-backend` on Oracle VM

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 17, TypeScript, Tailwind CSS |
| Backend | Django 4.2, Django REST Framework |
| Database | PostgreSQL 12 |
| Authentication | JWT (djangorestframework-simplejwt) |
| API Docs | drf-spectacular (OpenAPI) |
| Email | Resend (SMTP) |
| Task Queue | Celery + Redis (configured, optional) |
| Web Server | Nginx + Gunicorn |
| SSL | Let's Encrypt (Certbot) |
| Frontend Host | Vercel |
| Backend Host | Oracle Cloud Free Tier |
| Version Control | Git / GitHub |

---

## 4. Features Built & Live

### 4.1 Public Website (Frontend)

#### Home Page
- Hero section with value proposition and CTA buttons
- "How It Works" — 4-step onboarding timeline
- Services section with industry verticals
- Pricing plans (3 tiers) with feature lists
- Template showcase with real screenshots and live demo links
- Team section with member profiles and contact links
- Contact/lead capture form
- Sticky CTA bar
- Live activity feed component
- Trust badges and stats counter
- FAQ section
- Testimonials section
- Smooth scroll navigation
- Mobile-responsive navbar with hamburger menu
- Scroll-based active section highlighting

#### Template Showcase
7 real templates with live demos:

| Template | Industry | Live Demo |
|---|---|---|
| Aries Grooming | Barber Shop | https://arfahad99.github.io/AVT1_BarberShop/ |
| AVT Restaurant | Food & Beverage | https://abdsayeed.github.io/AVT1-Restaurant/ |
| Aries Ventures Barber | Barber Shop | https://arfahad99.github.io/AVT2_BarberShop/ |
| AVT Restaurant 2 | Food & Beverage | https://abdsayeed.github.io/AVT2/ |
| AVT Restaurant 3 | Food & Beverage | https://abdsayeed.github.io/AVT3/ |
| AVT Restaurant 4 | Food & Beverage | https://abdsayeed.github.io/AVT4/ |
| AV Saloon | Barber Shop | https://arfahad99.github.io/AVT3_Salon-master/ |

Template modal shows full description, screenshot, and "Live Demo" + "Use This Template" buttons.

#### Pricing Plans
- **Pay-As-You-Go** — £59/month (template-based, 6-12 month contract)
- **Fully Managed Professional** — £249/month (custom design, unlimited updates)
- **Full Professional Website** — Custom one-time price (full ownership)

Selecting a plan navigates to the contact form with the plan pre-selected.

### 4.2 Authentication System

#### User Registration
- Name, email, password, confirm password
- Password strength validation (8+ chars, uppercase, lowercase, number)
- Email format validation
- Input sanitization
- JWT tokens returned on success
- Redirects to home page after registration

#### User Login
- Email + password
- JWT access token (60 min) + refresh token (7 days)
- Token stored in localStorage
- Welcome popup notification on login (not on page refresh)
- Redirects to home page after login

#### Logout
- Calls `/api/auth/logout/` to invalidate refresh token
- Clears all localStorage tokens
- Updates auth state across all components

#### Session Persistence
- Tokens persist across page refreshes
- Auth state initialised from localStorage on app load
- Race condition protection during initialisation

### 4.3 User Dashboard
- Overview section with quick stats
- Projects list (empty state with CTA)
- Recent activity feed
- Quick action buttons
- Sidebar navigation
- Mobile responsive layout

### 4.4 User Profile
- View profile information
- Display user data (name, email, role)
- Logout button
- Navigation back to home

### 4.5 Multi-Step Contact Form
4-step lead capture form:
- **Step 1**: Business info (name, industry, website type)
- **Step 2**: Budget selection
- **Step 3**: Services needed (SEO, design, maintenance, content)
- **Step 4**: Contact details (email, phone, message)

Features:
- Progress bar
- Form state persisted in localStorage (survives page refresh)
- Context-aware (pre-fills from template or pricing selection)
- Submits to `/api/contact/submit/`
- Thank you page with reference number

### 4.6 Help Form
- Separate help/support form
- Category selection
- Message submission

### 4.7 Notification System
- Toast notifications (success, error, warning, info)
- Auto-dismiss after 4 seconds
- Manual close button
- Stacked notifications support

### 4.8 Loading States
- Global loading interceptor
- Spinner overlay during API calls
- Per-component loading states

---

## 5. Backend API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login, returns JWT tokens |
| POST | `/api/auth/logout/` | Logout, invalidates refresh token |
| GET | `/api/auth/profile/` | Get current user profile |
| PUT | `/api/auth/profile/` | Update profile |
| POST | `/api/auth/change-password/` | Change password |
| POST | `/api/auth/password-reset/` | Request password reset |
| POST | `/api/auth/token/refresh/` | Refresh access token |

### Contact
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/contact/submit/` | Submit contact/lead form |
| GET | `/api/contact/lookup/` | Look up submission by reference |

### Templates
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/templates/` | List all templates |
| GET | `/api/templates/{slug}/` | Get single template |

### Pricing
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/pricing/plans/` | List pricing plans |
| GET | `/api/pricing/plans/{slug}/` | Get single plan |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/analytics/track/` | Track user event |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notifications/` | Get user notifications |

---

## 6. Django Apps

| App | Purpose |
|---|---|
| `apps.users` | Custom user model, auth, JWT, profile management |
| `apps.contact` | Lead capture, form submissions, reference numbers |
| `apps.templates` | Website template catalogue |
| `apps.pricing` | Pricing plans and features |
| `apps.analytics` | Event tracking |
| `apps.notifications` | User notification system |

---

## 7. Database Models (Key)

### User (apps.users)
- UUID primary key
- Email as username field
- name, business_name, phone, avatar, bio, website
- role (customer / staff / admin)
- is_verified, email_notifications, marketing_emails
- JWT blacklist support

### ContactSubmission (apps.contact)
- Reference number (auto-generated)
- Business name, industry, website type
- Budget tier, services requested
- Contact details (email, phone)
- Status tracking (new → in_progress → completed)
- Timestamps

### Template (apps.templates)
- Name, slug, industry
- Description, features list
- Preview image, demo URL
- is_featured flag

### PricingPlan (apps.pricing)
- Name, slug, tier
- Price, billing period
- Features list
- is_popular flag

---

## 8. Security

- JWT tokens with short expiry (60 min access, 7 day refresh)
- Token rotation on refresh
- HTTPS enforced on both frontend and backend
- CORS restricted to `aris-ventures.com` only
- Django `SECURE_SSL_REDIRECT`, `SECURE_HSTS_SECONDS` enabled
- Input sanitization on all form fields
- Rate limiting configured (django-ratelimit)
- SQL injection protection via Django ORM
- XSS protection headers
- Admin URL accessible only via direct URL

---

## 9. Testing

- **Framework**: Karma + Jasmine
- **Browser**: Safari 18.6
- **Total tests**: 109
- **Passing**: 106 (97.2%)
- **Test files**:
  - `auth.service.spec.ts` — 20 tests
  - `api.service.spec.ts` — 18 tests
  - `login.component.spec.ts` — 20 tests
  - `register.component.spec.ts` — 20 tests
  - `notification.service.spec.ts` — 15 tests
  - `profile.component.spec.ts` — 13 tests (3 minor failures)

Run tests: `cd frontend && npm test`

---

## 10. Team

| Name | Role | Email |
|---|---|---|
| Abdullah Al Sayeed | Backend Developer | abdsayeedofficial@gmail.com |
| MD Nasif | Frontend Developer | Mdnasif17@gmail.com |
| AR Fahad | DevOps Engineer | mdarfahad@gmail.com |

---

## 11. Environment Variables

### Backend (.env on Oracle VM)
```
SECRET_KEY=<random 50 char key>
DEBUG=False
ALLOWED_HOSTS=193.123.178.104,api.aris-ventures.com,localhost
DB_NAME=aries_ventures
DB_USER=aries_user
DB_PASSWORD=<db password>
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOWED_ORIGINS=https://aris-ventures.com,https://www.aris-ventures.com
DJANGO_SETTINGS_MODULE=config.settings.production
RESEND_API_KEY=<optional - for email>
```

### Frontend (environment.prod.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.aris-ventures.com/api',
  frontendUrl: 'https://aris-ventures.com'
};
```

---

## 12. Deployment Guide

### Deploy Frontend (Vercel)
Automatic — push to `main` branch triggers Vercel rebuild.

Manual redeploy: Vercel Dashboard → Deployments → Redeploy

### Deploy Backend (Oracle Cloud)
SSH into the server and run:
```bash
ssh -i ~/Downloads/ssh-key-2026-04-06.key ubuntu@193.123.178.104
cd /home/ubuntu/AV_web
git pull origin main
cd backend
source venv/bin/activate
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart aries-backend
```

### Check Backend Status
```bash
sudo systemctl status aries-backend
sudo journalctl -u aries-backend -n 50 --no-pager
```

### Renew SSL (auto, but manual if needed)
```bash
sudo certbot renew
sudo systemctl restart nginx
```

---

## 13. Post-MVP Roadmap

### Phase 2 — Client Portal
- Client login dashboard
- Project status tracking
- Invoice and payment history
- File sharing (design assets, content)

### Phase 3 — Payments
- Stripe integration for subscription billing
- Automated invoice generation
- Payment failure handling and dunning

### Phase 4 — Automation
- Automated website provisioning on purchase
- GitHub Actions CI/CD for backend deploys
- Automated testing pipeline

### Phase 5 — Analytics
- Custom analytics dashboard
- Lead conversion tracking
- Template popularity metrics
- Revenue reporting

### Phase 6 — Scale
- Upgrade Oracle VM to A1.Flex (ARM, 4 OCPU, 24GB RAM)
- Add Redis for caching and Celery task queue
- CDN for static assets
- Database backups to object storage

---

## 14. Known Issues & Limitations

| Issue | Impact | Fix |
|---|---|---|
| Oracle E2.1.Micro has 1GB RAM | Low — Django runs fine with 2 workers | Upgrade to A1.Flex when available |
| No email sending configured | Medium — registration emails not sent | Add Resend API key to .env |
| 3 failing profile tests | Low — component works correctly | Update test expectations |
| No automated backend deploys | Low — manual git pull required | Add GitHub Actions webhook |
| SQLite used in dev | None — PostgreSQL in production | Keep as-is |

---

## 15. Quick Reference

| Item | Value |
|---|---|
| Live site | https://aris-ventures.com |
| API base | https://api.aris-ventures.com/api |
| Admin panel | https://api.aris-ventures.com/admin/ |
| Admin email | admin@ariesventures.co.uk |
| Admin password | Admin1234! |
| Oracle IP | 193.123.178.104 |
| SSH key | ~/Downloads/ssh-key-2026-04-06.key |
| SSH user | ubuntu |
| DB name | aries_ventures |
| DB user | aries_user |
| GitHub repo | https://github.com/abdsayeed/AV_web |
