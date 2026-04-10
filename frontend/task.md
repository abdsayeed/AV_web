Prompt for Advanced Aries Ventures Platform (Angular + Django Upgrade)
Objective
Upgrade the Aries Ventures platform to a production-grade, fully functional full-stack web application. Every feature, button, and flow must work end-to-end. The current MVP has placeholder UI elements, non-functional OAuth, missing email integration, and incomplete features. This upgrade delivers a complete, optimised, and scalable product while retaining the Angular 17 frontend and Django backend, upgrading both to their latest stable versions, adding a normalised relational database schema, real-time capabilities, and automated infrastructure.

Structure
Frontend: Angular 18 (latest stable, standalone components, signals-based reactivity)

Styling: Tailwind CSS v4 with the existing "Structured Fluidity" MD3 design tokens faithfully preserved
Fonts: Plus Jakarta Sans (headlines) · Inter (body) · JetBrains Mono (data/labels) via Google Fonts
Icons: Lucide Angular
Animation: Angular Animations + GSAP for scroll-triggered reveals, page transitions, and count-up stats
Forms: Angular Reactive Forms + Zod-equivalent validation via class-validator on both client and server
State: NgRx Signals Store for global auth/cart state; Angular Query (TanStack Query for Angular) for all server-state and API caching
Component library: Angular Material v18 as the base, extended with custom MD3-aligned variants matching the existing design system

Backend: Django 5.x + Django REST Framework (same stack, major upgrade)

Auth: Django REST Framework SimpleJWT upgraded to full rotating refresh tokens + Google OAuth via social-auth-app-django — fully wired, replaces the current broken OAuth stub
Email: Resend SDK (Python) — transactional emails for registration, password reset, lead confirmation, and invoice delivery
File uploads: django-storages + Uploadthing (or S3-compatible) — client asset uploads (logos, brand photos)
Background jobs: Trigger.dev (HTTP-based task triggering from Django views) — async tasks (email queuing, analytics aggregation, notification dispatch)
Rate limiting: Upstash Redis via upstash-redis Python SDK on all auth and form submission endpoints
WebSockets: Django Channels (ASGI) for real-time notifications and project message threads
API layer: Django REST Framework with tRPC-style type safety enforced via Pydantic v2 serializers shared between frontend (via generated TypeScript interfaces using openapi-typescript) and backend

Database: PostgreSQL 16 (upgrade from PostgreSQL 12) + Django ORM

Fully normalised schema (3NF minimum) — see Task 1 for full table list
Django migrations for all schema changes; zero raw SQL
Row-level security policies enforced at the Django ORM layer via queryset filtering


Monorepo Layout (Turborepo + pnpm workspaces — new structure)
aries-ventures/
├── apps/
│   ├── web/                        # Angular 18 app
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── core/           # Auth, interceptors, guards, services
│   │   │   │   ├── shared/         # UI components, pipes, directives
│   │   │   │   ├── features/       # Feature modules (home, dashboard, contact, admin)
│   │   │   │   └── layout/         # Nav, footer, sidebar shell
│   │   │   ├── environments/
│   │   │   └── styles/
│   │   ├── angular.json
│   │   └── package.json
│   └── api/                        # Django 5.x backend
│       ├── config/                 # Django settings (base, dev, prod)
│       ├── apps/
│       │   ├── authentication/     # JWT, OAuth, registration, password reset
│       │   ├── businesses/         # Business profiles
│       │   ├── contact/            # Contact form submissions
│       │   ├── projects/           # Project management
│       │   ├── notifications/      # WebSocket notifications
│       │   ├── analytics/          # Event tracking
│       │   └── admin_panel/        # Admin-specific endpoints
│       ├── core/                   # Shared base models, permissions, mixins
│       ├── requirements/           # base.txt, dev.txt, prod.txt
│       └── manage.py
├── packages/
│   ├── types/                      # Shared TypeScript interfaces generated from Django OpenAPI schema
│   ├── validators/                 # Shared validation rules (Python + TS mirrored)
│   └── config/                     # ESLint, Tailwind, TypeScript configs
├── .github/workflows/
├── turbo.json                      # Turborepo build pipeline
└── pnpm-workspace.yaml

Tasks
Task 1 — Database Schema (Django ORM, PostgreSQL 16 upgrade)
Design and implement a fully normalised schema. All primary keys are UUIDs (uuid_generate_v4()). All timestamps use timestamptz. Enforce foreign key constraints and add db_index=True on every FK and common filter column. Upgrade the existing PostgreSQL 12 database to PostgreSQL 16 with a documented migration path.
Core models (one Django app per domain):
authentication app:

User — id (UUID), email (unique), name, hashed_password (nullable for OAuth users), avatar_url, role (enum: customer | staff | admin), is_verified, created_at, updated_at — extends AbstractBaseUser
OAuthAccount — id, user (FK → User), provider (enum: google), provider_account_id, access_token, refresh_token, expires_at — allows one user to have multiple OAuth providers
PasswordResetToken — id, user (FK → User), token_hash, expires_at, used_at
EmailVerificationToken — id, user (FK → User), token_hash, expires_at, used_at

businesses app:

Industry — id, slug (unique), label, icon_name — lookup table for the 6 industry types (barbershop | restaurant | salon | retail | trades | other); no hardcoding in application code
Business — id, user (FK → User, OneToOne), name, industry (FK → Industry), phone, address_line1, address_line2, city, postcode, country, website_url, logo_url, description, created_at, updated_at

templates app:

Template — id, slug (unique), name, industry (FK → Industry), description, preview_image_url, demo_url, badge (nullable enum: popular | high_conversion | new), is_featured, is_active, sort_order, created_at, updated_at
TemplateFeature — id, template (FK → Template), feature_text, sort_order

pricing app:

PricingPlan — id, slug (unique), name, tier (enum: basic | pro | custom), price_pence (integer — avoids float), billing_period (enum: monthly | one_time), is_popular, is_active, sort_order, created_at, updated_at
PlanFeature — id, plan (FK → PricingPlan), feature_text, is_highlighted, sort_order

contact app:

ContactSubmission — id, user (FK → User, nullable — guests can submit), reference_number (unique, generated: AV-YYYY-NNNN), business_name, industry (FK → Industry), website_type (enum: new | redesign | landing_page | e_commerce), budget_tier (FK → PricingPlan), contact_name, email, phone, message, status (enum: new | reviewing | in_progress | completed | archived), assigned_to (FK → User, nullable — staff assignment), created_at, updated_at
SubmissionService — id, submission (FK → ContactSubmission), service (enum: seo | design | maintenance | content)

projects app:

Project — id, submission (FK → ContactSubmission, OneToOne), user (FK → User), template (FK → Template, nullable), name, status (enum: brief | design | build | review | live), live_url (nullable), staging_url (nullable), started_at, launched_at, created_at, updated_at
ProjectStatusHistory — id, project (FK → Project), status, changed_by (FK → User), note, created_at — full audit trail
ProjectFile — id, project (FK → Project), uploaded_by (FK → User), file_name, file_url, file_size_bytes, mime_type, category (enum: asset | content | deliverable | other), created_at
Message — id, project (FK → Project), sender (FK → User), body, is_read, read_at, created_at

notifications app:

Notification — id, user (FK → User), type (enum: project_update | message | system), title, body, action_url (nullable), is_read, read_at, created_at

analytics app:

AnalyticsEvent — id, user (FK → User, nullable), session_id (varchar, anonymous), event_type (enum: page_view | cta_click | form_start | form_complete | template_view | demo_click), page_url, referrer, metadata (JSONField), created_at — append-only
AuditLog — id, actor (FK → User, nullable), action, entity_type, entity_id, before_state (JSONField, nullable), after_state (JSONField, nullable), ip_address, created_at — admin actions only, append-only

Write all models in their respective apps/<domain>/models.py. Generate and run the initial migration (python manage.py makemigrations && python manage.py migrate). Write a management command (python manage.py seed_db) that populates Industries, all 7 Templates with features, and all 3 PricingPlans.

Task 2 — Authentication (Django JWT upgraded, fully wired)
Upgrade the existing broken JWT system to a complete, production-grade auth implementation:

JWT upgrade: Replace the current SimpleJWT configuration with rotating refresh tokens — access token TTL 15 minutes, refresh token TTL 7 days, stored in HttpOnly cookies (not localStorage). Implement token rotation: every refresh call issues a new refresh token and blacklists the old one via SimpleJWT's token blacklist app.
Google OAuth: Fully wire social-auth-app-django — on first OAuth sign-in, create a User row and an OAuthAccount row; on subsequent sign-ins, look up by provider_account_id and return existing user. Link accounts if the same email exists from credentials sign-up.
Registration: POST /api/auth/register/ — validate with DRF serializer + class-validator equivalents (name, email, password min 8 chars with complexity), hash with bcrypt (cost 12), insert user, send welcome email via Resend, return access + refresh tokens.
Email verification: On register, send a verification email with an HMAC-SHA256 signed token (24h expiry). GET /api/auth/verify-email/?token= sets is_verified = True.
Password reset: POST /api/auth/forgot-password/ — generate a signed reset token stored in PasswordResetToken, email the link via Resend. POST /api/auth/reset-password/ — validate token, update hashed password, mark token used, blacklist all existing refresh tokens for that user.
Change password: Authenticated endpoint — verify current password, update hash, optionally invalidate other sessions.
Angular auth integration: Replace the current broken AuthService with a complete implementation using Angular's HttpClient + interceptors. JwtInterceptor attaches the access token to every request. TokenRefreshInterceptor catches 401 responses, calls the refresh endpoint once (with queuing for concurrent requests), and retries the original request. AuthGuard protects all /dashboard, /onboarding, /profile routes. GuestGuard redirects /login and /register to /dashboard if a valid token exists.
Rate limiting: Upstash Redis sliding window via Django middleware — 5 login attempts per 15 minutes per IP, 3 password reset requests per hour per IP.


Task 3 — Public Homepage (fully functional, animated)
Rebuild every homepage section as a proper Angular component, replacing all placeholder/non-functional elements:

Nav: Sticky glassmorphism bar with scroll-based background opacity transition (GSAP ScrollTrigger). Auth-aware via AuthService signal — renders correct state with no flash of wrong content. Mobile: animated slide-down menu with staggered link entrance (Angular Animations). Active section highlighting via IntersectionObserver.
Hero: Full-viewport with ambient CSS gradient blobs, dot-grid SVG background, animated headline with word-by-word entrance (Angular Animations), two CTAs, social proof strip. Floating cards use CSS transform with will-change: transform; hover transitions are pure CSS.
Stats counter: IntersectionObserver triggers count-up only when in viewport. Stats sourced from a Django API endpoint backed by real DB aggregations — not hardcoded.
How It Works: 4-step grid. Desktop connector line drawn with SVG stroke-dasharray animation on scroll.
Ideal Clients: 6 industry cards sourced from /api/industries/ endpoint. Hover transitions pure CSS.
Pricing: Fetched from /api/pricing/plans/ endpoint (PricingPlan + PlanFeature). "Get Started" buttons fully wired — authenticated users are redirected to /contact?plan=<slug>; guests go to /register?plan=<slug> with plan saved in sessionStorage for post-auth redirect.
Templates gallery: Fetched from /api/templates/ endpoint. "View All" toggle shows/hides the 7th card with Angular Animations layout animation. Detail modal opens and updates the URL to /templates/<slug> via Angular Router so it is shareable/bookmarkable. "Use This Template" passes context to the contact form via query params.
Testimonials, FAQ, Trust Badges, Footer: Rebuilt as proper Angular components with real data from the API. FAQ accordion uses Angular Animations max-height transition.
Live activity toasts: NgRx Signals store, 6 rotating entries every 4 seconds, entrance/exit Angular Animations, respects prefers-reduced-motion.
Sticky CTA bar: Shown only after user scrolls past hero; hidden on /contact, /login, /register.

All images use NgOptimizedImage with correct width, height, sizes, and priority on above-the-fold images.

Task 4 — Contact Form (multi-step, fully wired)
Rebuild the 4-step contact form as an Angular component with NgRx Signals for step state and Angular Reactive Forms + class-validator per step:

Step 1: Business name (required, 2–100 chars), industry (select from /api/industries/, loaded once at mount via Angular Query), website type (radio: new | redesign | landing_page | e_commerce)
Step 2: Budget tier (radio cards fetched from /api/pricing/plans/ — shows price + key features inline). Pre-selected if user arrived via ?plan=<slug>.
Step 3: Services multi-select (seo | design | maintenance | content) as toggle chips. Pre-selected if user arrived via template modal.
Step 4: Full name (auto-filled from auth service if logged in), email (auto-filled), phone (E.164 validation), message (min 20 chars, max 1000)
Progress bar: Angular Animations width transition. Step indicator dots with completed/active/pending states.
Form persistence: Saves form state to sessionStorage on each step change. Restored on component init.
Submission: POST /api/contact/submit/ — validates with DRF serializer, inserts ContactSubmission + SubmissionService rows in a DB transaction, generates AV-YYYY-NNNN reference, triggers Trigger.dev background job that sends confirmation email to client and internal alert to team, returns { reference_number }.
Thank-you page: Reference number displayed, animated checkmark, vertical timeline of next steps. "Track your enquiry" button for authenticated users links to /dashboard/projects.
Rate limited: 3 submissions per IP per hour via Upstash Redis.


Task 5 — Client Dashboard (fully functional)
Implement a full dashboard at /dashboard using a persistent sidebar shell layout in Angular:

Sidebar: Auth-aware via AuthService signal. Logo, nav links with active state (routerLinkActive), user avatar + name + plan badge, sign-out button.
Overview tab: Stat cards (active projects, open messages, current plan) — all from real API calls via Angular Query. Quick actions: "Start a project" → /onboarding, "Browse templates" → /templates. Recent activity feed from ProjectStatusHistory and Notification endpoints.
Projects tab: Lists all projects from /api/projects/ for this user. Each card shows project name, current status as a step progress bar (brief → design → build → review → live), template used, live URL when available, last updated timestamp. Clicking opens /dashboard/projects/:id — full project detail with status timeline (from ProjectStatusHistory), file list (from ProjectFile), and message thread.
Messages tab: Project-scoped threads. Unread count badge on sidebar. Mark-as-read on view via PATCH /api/messages/:id/read/. Reply box submits to POST /api/messages/, triggers Notification for recipient. Real-time updates via Django Channels WebSocket — new messages appear without page refresh.
Notifications: Bell icon in header with unread count from /api/notifications/. Dropdown list; clicking marks as read and navigates to action_url. Real-time delivery via Django Channels WebSocket.
Profile settings (/profile): Edits User + Business rows via PATCH /api/profile/. Business logo upload via Uploadthing → stores URL in Business.logo_url. Password change. "Delete account" with confirmation modal — soft-delete (deleted_at) and data anonymisation.


Task 6 — Email System (Resend, fully wired)
Create HTML email templates for every transactional email using Django's template engine. All emails use the Aries Ventures brand (logo, MD3 colours, Inter font). Send via Resend Python SDK from Trigger.dev background jobs — never from the request path directly.
Emails to implement:

Welcome email (on register) — includes verify email link
Email verification — signed link, expires 24h
Password reset — signed link, expires 1h
Contact form confirmation — sent to client with reference number and next steps timeline
Internal lead alert — sent to team with full submission detail and link to admin panel
Project status update — sent to client when project status changes
New message notification — sent to recipient when a message is sent in their project thread
Subscription/plan confirmation — sent when a user selects a plan via the contact form

All email sending is enqueued as a Trigger.dev job from Django using an HTTP trigger. The Django view fires the trigger and returns immediately; the job handles retries, logging, and error reporting.

Task 7 — Onboarding Wizards

Quick onboarding (/onboarding): 4-step Angular wizard using Reactive Forms + Angular CDK Stepper. Step 1 industry selection reads from /api/industries/. Step 4 budget selection reads from /api/pricing/plans/. On finish, if user has no plan recorded, redirect to /contact?plan=<slug>; otherwise redirect to /contact with context pre-filled via query params.
Guided onboarding (/onboarding/guided): 5-step wizard with live preview sidebar. The preview sidebar renders a mock browser chrome containing an <iframe> pointed at the selected template's demo_url — the real demo loads. Brand colour picker (6 swatches) applies a CSS custom property to the iframe via postMessage if the template supports it. On submit, creates a draft ContactSubmission row with status = 'new' and redirects to /contact/thank-you with the reference number.


Task 8 — Admin Panel (/admin)
Access restricted to users with role = 'admin' via Django permission classes + Angular AdminGuard.

Submissions: Angular AG Grid (or TanStack Table Angular) of all ContactSubmission records. Columns: reference, business name, industry, plan, status, assigned to, created at. Inline status update dropdown — updates DB + inserts AuditLog row. Assign to staff member dropdown. Bulk actions: mark reviewed, archive.
Projects: List of all projects with status. Click to open project detail; admin can move status forward/back, add internal notes, upload deliverable files.
Users: Searchable list of all users. Columns: name, email, role, plan, verified, joined. Role change (admin action — logged to AuditLog). Impersonate user functionality.
Templates: Full CRUD for Template and TemplateFeature. Image upload via Uploadthing. Drag-to-reorder sort_order. Toggle is_featured and is_active.
Pricing: Edit PricingPlan and PlanFeature records via admin API endpoints.
Analytics dashboard: Aggregated queries from AnalyticsEvent — page views over time (line chart via Chart.js Angular wrapper), top pages, CTA click-through rates, form funnel (start vs complete), template popularity. Date range picker. All queries via /api/admin/analytics/ endpoints with Angular Query caching.


Task 9 — Real-Time Features (Django Channels)
Implement Django Channels (ASGI) for all real-time functionality:

WebSocket endpoint: ws://api/ws/notifications/ — authenticated via JWT token passed as query param on connection. Each user joins a personal channel group (user_<uuid>).
Notification dispatch: When a Notification row is created (via signal or Trigger.dev job), broadcast it to the user's channel group. Angular WebSocketService receives and pushes to an NgRx Signals store slice.
Message threads: ws://api/ws/projects/<id>/messages/ — project-scoped channel group. New messages broadcast to all project participants in real time.
Project status updates: When Project.status changes, broadcast to all project participants.
Connection management: Heartbeat ping every 30 seconds. Angular service auto-reconnects with exponential backoff on disconnect.


Task 10 — Performance, SEO & Observability

SEO: Angular Universal SSR (or Angular 18 built-in SSR) for all public pages — proper <title>, <meta>, canonical URLs, and OG tags set per route via Angular's Meta and Title services. sitemap.xml generated by a Django management command at deploy time.
Structured data: JSON-LD LocalBusiness schema on homepage. Product schema on pricing page. FAQPage schema for FAQ section — injected via Angular DOCUMENT token.
Performance: Django REST Framework response caching via django-cache-machine or Redis cache backend for infrequently changing data (industries, templates, pricing). Cache TTL 1 hour. Dashboard and admin endpoints are uncached.
Bundle analysis: Angular's ng build --stats-json + webpack-bundle-analyzer. Target: < 100kB initial bundle for the homepage route.
Error tracking: Sentry SDK on both Angular (@sentry/angular) and Django (sentry-sdk[django]) — captures all unhandled errors with source maps. Custom beforeSend strips PII (email, phone) from error payloads.
Analytics: AnalyticsEvent table for internal analytics. Angular service fires POST /api/analytics/event/ on page view, CTA click, form start/complete, template view.
Health check: GET /api/health/ — returns { status: 'ok', db: 'ok', uptime: N } by running a SELECT 1 via Django ORM and reporting process uptime.
Logging: Structured JSON logging in Django via python-json-logger, shipped to Axiom or a compatible log aggregator.


Output Requirements

Complete, runnable monorepo — pnpm install && pnpm dev starts both the Angular dev server and the Django dev server concurrently via Turborepo
All environment variables documented in a root .env.example with every required key listed and described
python manage.py seed_db populates all lookup tables, templates, and pricing plans so the app is functional immediately after running
Django migrations checked into apps/api/ — python manage.py migrate applies them against any target database
GitHub Actions workflows: ci.yml (lint, type-check, Python tests, Angular tests on PR) and deploy.yml (deploy frontend to Vercel, backend to Railway/Render on merge to main)
README covering: local setup, environment variables, database setup (including PostgreSQL 12 → 16 upgrade path), running tests, deployment, and architecture decision log
Playwright E2E test suite covering: homepage renders correctly → user registers → email verified → completes contact form → receives confirmation → logs in → views dashboard → admin views submission
No hardcoded data anywhere in application code — all content (industries, templates, pricing, testimonials) lives in the database and is seeded via seed_db


Constraints & Notes

Preserve the exact "Structured Fluidity" design system — all MD3 tokens, rounded-full buttons, rounded-3xl cards, glassmorphism nav, ambient blob hero, and the #0058be secondary accent colour must be faithfully reproduced in Tailwind v4
The three team members (Abdullah Al Sayeed, MD Nasif, AR Fahad), all 7 templates with their exact GitHub Pages demo URLs, all 3 pricing tiers at their current prices, and the three testimonials must be present and seeded from manage.py seed_db — not hardcoded in components
Google OAuth credentials must be documented as required environment variables; the OAuth callback URL for local dev (http://localhost:8000/auth/complete/google-oauth2/) and production must both be registered in the Google Cloud Console
The RESEND_API_KEY must actually be set and emails must send in development — use Resend's sandbox mode (onboarding@resend.dev sender) for local dev
All monetary values stored as integer pence (£59/mo = 5900, £249/mo = 24900) — never floats
Django models must use TextChoices for all enum columns — not plain CharField with a check constraint
All API endpoints that mutate data must insert a row into AuditLog for admin-initiated actions
prefers-reduced-motion media query must disable all GSAP and Angular Animations globally — set via a root Angular service that reads the media query and disables AnimationPlayer where applicable
PostgreSQL 12 → 16 upgrade: Document the pg_upgrade or dump-and-restore path in the README; the Django schema must be forward-compatible with both versions during the transition window
Django Channels requires ASGI deployment — document the switch from WSGI (gunicorn) to ASGI (daphne or uvicorn) in the README and deploy.yml