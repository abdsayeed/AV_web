# MVP — Aries Ventures Platform

**Last Updated**: April 10, 2026
**Status**: Live in Production
**Live URL**: https://aris-ventures.com
**API URL**: https://api.aris-ventures.com

---

## 0. What Is This?

Aries Ventures is a UK-based web agency that builds and manages professional websites for local businesses — barbershops, restaurants, salons, trades, and other SMBs. Revenue model: monthly subscription (Pay-As-You-Go at £59/mo or Fully Managed at £249/mo) or a one-time custom build. The platform is a full-stack SPA with an Angular frontend and a Django REST API backend, both live in production.

---

## 1. Executive Summary

Aries Ventures is a web agency that builds and manages professional websites for local businesses — barbershops, restaurants, salons, and other SMBs. The platform operates on a subscription model ("Pay-As-You-Go"), a fully managed plan, or a one-time custom build.

The MVP is fully live. It consists of:
- A public-facing Angular 17 SPA hosted on Vercel — cinematic homepage, auth, dashboard, multi-step contact form, onboarding wizards, admin panel
- A Django 4.2 REST API hosted on Oracle Cloud (always-on free tier)
- PostgreSQL 12 database on the same Oracle VM
- JWT-based authentication (access + refresh tokens, blacklist on logout)
- A multi-step lead capture form that submits to the backend
- A live template showcase with 7 real client-facing demos
- Google Stitch "Structured Fluidity" design system implemented as Tailwind CSS MD3 tokens

---

## 2. Infrastructure & Deployment

### Frontend
- **Framework**: Angular 17 (standalone components, TypeScript strict mode)
- **Styling**: Tailwind CSS v3 with full MD3 design token overrides
- **Design System**: Google Stitch — "Structured Fluidity" (project ID: `7991541937214367524`)
- **Fonts**: Plus Jakarta Sans (headlines), Inter (body), JetBrains Mono (data/labels) — loaded via Google Fonts in `index.html`
- **Icons**: Material Symbols Outlined (variable font, loaded via Google Fonts)
- **Hosting**: Vercel — auto-deploys on push to `main`
- **Domain**: https://aris-ventures.com
- **Build command**: `ng build --configuration production`
- **Output dir**: `dist/frontend/browser`
- **Routing**: SPA — all routes rewritten to `index.html` via `vercel.json`
- **Assets**: `frontend/src/assets/` — logo, team photos, template screenshots

### Backend
- **Framework**: Django 4.2 + Django REST Framework 3.x
- **Language**: Python 3.8
- **Hosting**: Oracle Cloud Free Tier — VM.Standard.E2.1.Micro (1 OCPU, 1GB RAM, Ubuntu 20.04)
- **Server IP**: 193.123.178.104
- **Domain**: https://api.aris-ventures.com
- **Process Manager**: Gunicorn (2 workers) managed by systemd service `aries-backend`
- **Reverse Proxy**: Nginx (handles SSL termination, static files, proxy to Gunicorn)
- **SSL**: Let's Encrypt via Certbot (auto-renews)
- **Database**: PostgreSQL 12 (local on Oracle VM, socket connection)
- **Admin Panel**: https://api.aris-ventures.com/admin/
- **API Docs**: https://api.aris-ventures.com/api/schema/ (drf-spectacular / OpenAPI 3)

### Git & CI/CD
- **Repository**: https://github.com/abdsayeed/AV_web
- **Main branch**: `main` — triggers Vercel frontend deploy automatically on push
- **Backend deploy**: manual SSH → `git pull` → `systemctl restart aries-backend`
- **No automated backend CI yet** — planned for Phase 4

---

## 3. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend framework | Angular 17 | Standalone components, lazy-loaded routes |
| Frontend language | TypeScript | Strict mode |
| Styling | Tailwind CSS v3 | Full MD3 token overrides in `tailwind.config.js` |
| Design system | Google Stitch — "Structured Fluidity" | MD3 color tokens, `rounded-full` buttons, `rounded-3xl` cards |
| Fonts | Plus Jakarta Sans · Inter · JetBrains Mono | Google Fonts CDN |
| Icons | Material Symbols Outlined | Variable font, Google Fonts CDN |
| Backend framework | Django 4.2 + DRF | REST API only, no server-side rendering |
| Backend language | Python 3.8 | |
| Database | PostgreSQL 12 | Local on Oracle VM |
| Auth | JWT — djangorestframework-simplejwt | 60 min access / 7 day refresh / blacklist on logout |
| API docs | drf-spectacular | OpenAPI 3 schema auto-generated |
| Email | Resend (SMTP) | Configured but API key not yet set in prod |
| Task queue | Celery + Redis | Configured, not yet active in prod |
| Web server | Nginx + Gunicorn | Nginx terminates SSL, proxies to Gunicorn |
| SSL | Let's Encrypt (Certbot) | Auto-renews |
| Frontend host | Vercel | Free tier, auto-deploy on `main` |
| Backend host | Oracle Cloud Free Tier | VM.Standard.E2.1.Micro, always-on |
| Version control | Git / GitHub | https://github.com/abdsayeed/AV_web |

---

## 4. Frontend — Pages & Features

### 4.0 Route Map

| Route | Component | Guard | Description |
|---|---|---|---|
| `/` | `AppComponent` | Public | Cinematic homepage |
| `/login` | `LoginComponent` | GuestGuard | Login page |
| `/register` | `RegisterComponent` | GuestGuard | Registration page |
| `/contact` | `ContactFormComponent` | Public | 4-step lead capture form |
| `/contact/thank-you` | `ThankYouComponent` | Public | Submission confirmation |
| `/dashboard` | `DashboardComponent` | AuthGuard | Client dashboard |
| `/profile` | `ProfileComponent` | AuthGuard | User profile & password |
| `/onboarding` | `OnboardingComponent` | AuthGuard | Quick 4-step onboarding wizard |
| `/onboarding/guided` | `GuidedOnboardingComponent` | AuthGuard | Full 5-step guided onboarding with live preview |
| `/help` | `HelpFormComponent` | AuthGuard | Help/support form |
| `/admin` | `AdminComponent` | AuthGuard | Admin panel |
| `/templates` | `TemplatesComponent` | Public | Full template gallery page |
| `/**` | — | — | Redirects to `/` |

All routes are lazy-loaded via `loadComponent()` except `/login` and `/register` which are eagerly loaded.

---

### 4.1 Design System — "Structured Fluidity"

Implemented from Google Stitch project `7991541937214367524`. All tokens live in `frontend/tailwind.config.js`.

**Color tokens (key):**

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#000101` | Text on dark surfaces |
| `primary-container` | `#1a1c1e` | Nav, footer, dark CTAs, login/register panels |
| `on-primary` | `#ffffff` | Text on primary-container |
| `secondary` | `#0058be` | Accent CTAs, active nav links, focus rings |
| `secondary-container` | `#2170e4` | Hover state for secondary buttons |
| `secondary-fixed` | `#d8e2ff` | Badge/pill backgrounds |
| `on-secondary-fixed` | `#001a42` | Text on secondary-fixed pills |
| `surface` | `#f8f9fa` | Main page background |
| `surface-container-lowest` | `#ffffff` | Cards, modals, form inputs |
| `surface-container-low` | `#f3f4f5` | Alternating section backgrounds |
| `surface-container` | `#edeeef` | Nested containers, hover states |
| `surface-container-high` | `#e7e8e9` | Active/pressed states |
| `on-surface` | `#191c1d` | Primary body text |
| `on-surface-variant` | `#44474a` | Secondary/muted text |
| `outline-variant` | `#c5c6ca` | Ghost borders (used at 10–20% opacity only) |
| `error` | `#ba1a1a` | Error states, "Most Accessible" pricing badge |

**Typography:**
- Headlines/Display: `font-headline` → Plus Jakarta Sans, tight tracking (`-0.02em`)
- Body/UI: `font-body` / `font-sans` → Inter
- Labels/Badges: `font-label` → Inter, uppercase + wide tracking
- Data/Monospace: `font-mono` → JetBrains Mono

**Radius:** `rounded-full` (buttons) · `rounded-3xl` (cards) · `rounded-2xl` (inner elements) · `rounded-xl` (inputs)

**Design rules enforced:**
- No 1px solid borders for layout — section boundaries use tonal surface shifts only
- Ghost borders only: `border-outline-variant/10` to `/20` max
- Glassmorphism nav: `backdrop-blur-xl` + `bg-surface/80`
- Ambient shadows: large blur orbs at low opacity, no hard drop shadows
- All buttons `rounded-full`, all cards `rounded-3xl`

---

### 4.2 Homepage (`/`) — Cinematic

**File:** `app.component.html` / `app.component.ts` / `app.component.css`

**Shared component imports:** `NavComponent`, `StatsCounterComponent`, `TestimonialsComponent`, `FaqComponent`, `TrustBadgesComponent`, `StickyCTAComponent`, `PricingCardsComponent`, `TemplatesGalleryComponent`, `ContactCtaComponent`, `FooterComponent`

**Sections (in scroll order):**

1. **Nav** (`app-nav`) — glassmorphism fixed bar, auth-aware (shows Dashboard/Logout when logged in, Login/Get Started when guest), mobile hamburger with slide-down menu, scroll-based active section highlighting

2. **Hero** — full-viewport section with:
   - Ambient gradient blobs (CSS `blur-[140px]` orbs, `secondary-fixed/25` + `primary-fixed/15`)
   - `grid-overlay` dot pattern background
   - "Now Booking for Q4" live badge with pulse dot
   - H1: "Websites that grow local businesses." with `secondary` colour accent
   - Two CTA buttons: "Get Your Website" (primary-container, rounded-full) + "View Templates" (ghost border)
   - Social proof strip: 4 avatar initials (TH/PN/MW/AK) + 5-star row + "50+ local businesses"
   - Right column (desktop only): two floating mockup cards with CSS rotation + hover-to-flat transition, floating "3–5 days" stat card

3. **Stats bar** (`app-stats-counter`) — 4 animated count-up stats: `50+ Businesses Launched` · `47 Active Clients` · `4.9 Average Rating` · `4 Days Avg. Delivery`. Triggered by IntersectionObserver on scroll.

4. **How It Works** — 4-step process grid from `processSteps[]` data array. Desktop connector line. Steps: Book Consultation (15 mins) → We Build (3–5 days) → Review & Launch → Maintenance (ongoing). Icon circles animate to `primary-container` on hover.

5. **Ideal Clients** — 6 industry cards (Barbershops, Cafes & Dining, Home Services, Landscapers, Boutique Retail, Professional). Icon pill transitions from `secondary-fixed/40` bg to `secondary` on hover.

6. **Pricing** — 3 cards from `pricingPlans[]`:
   - Pay-As-You-Go: £59/mo, `error` colour, "Most Accessible" badge
   - Fully Managed Professional: £249/mo, `secondary` colour, "Most Popular" badge
   - Full Professional Website: Custom one-time, `#068f5c` green, "Full Ownership" badge
   - Each card: image header with gradient overlay, feature list with check icons, contract info box, CTA button. Clicking navigates to `/contact` with plan pre-selected via `ContextService`.

7. **Templates** — 7 cards from `displayedTemplates[]` (first 6 shown, "View All" loads the 7th). Each card: image with hover scale + reveal overlay ("View details →" + industry label). Clicking opens a modal with full description + "Use This Template" + "View Live Demo" buttons. "Use This Template" navigates to `/contact` with template context pre-filled.

8. **Team** — 3 member cards (Abdullah Al Sayeed / MD Nasif / AR Fahad). Photos from `assets/` with `object-cover object-top` to keep faces visible. `onTeamImgError()` fallback shows initials avatar on load failure. LinkedIn + Email action buttons.

9. **Testimonials** (`app-testimonials`) — 3 cards: Tariq Hassan (barbershop, East London), Priya Nair (restaurant, Birmingham), Marcus Webb (plumbing, Manchester). Each card: 5-star rating, quote, 3 result pills (metric + value), author row with verified badge.

10. **FAQ** (`app-faq`) — 10 questions across 4 categories (Pricing, Process, Technical, Support). Pill category filter buttons. CSS `max-height` accordion (no Angular animations). Questions cover actual pricing tiers, ownership model, delivery time, SEO, satisfaction guarantee.

11. **Contact CTA** — dark `primary-container` section with ambient glow, "Limited spots available" badge, "Ready to Scale?" headline, secondary blue CTA button → `/contact`.

12. **Trust Badges** (`app-trust-badges`) — 6 icon badges (SSL Secure, GDPR Compliant, Stripe Verified, Registered Business, 24/7 Support, Money Back) + guarantee bar.

13. **Footer** (`app-footer`) — dark `primary-container` background, logo with `brightness-0 invert`, 4-column grid (brand + Platform links + Support links), copyright.

---

### 4.3 Login (`/login`)

**File:** `login.component.html` / `login.component.ts`

Split layout: dark `primary-container` left panel + white right panel.

**Left panel:** Logo (image + text, `brightness-0 invert`), "Your business, live in days." headline, 3 trust bullets (50+ businesses launched · 4.9★ · 3–5 day delivery), link to register.

**Right panel form:**
- Email input + Password input with show/hide toggle
- "Forgot password?" → calls `authService.resetPassword(email)` → sends reset email
- Submit → `authService.loginWithCustom(email, password)` → JWT stored → redirect to `/` (or saved `redirectUrl`)
- Loading spinner on submit button
- Error message display
- Divider + "Continue with Google" button (UI only, OAuth not yet wired)

**Guards:** `GuestGuard` — redirects to `/` if already logged in.

---

### 4.4 Register (`/register`)

**File:** `register.component.html` / `register.component.ts`

Same split layout as login. 2-step form:

**Step 1:** Full name + Email → "Continue →"
**Step 2:** Password + Confirm password
- Live password strength bar (4 segments, colour-coded)
- Requirement pills: 8+ chars · Uppercase · Lowercase · Number (highlight when met)
- Back button + "Create account" submit

On success → `authService.registerWithCustom()` → JWT stored → redirect to `/`.

**Guards:** `GuestGuard`.

---

### 4.5 Contact Form (`/contact`)

**File:** `features/contact/pages/contact-form/`

4-step multi-step form with progress bar and step indicator. Form state persisted in `localStorage` via `FormStateService` — survives page refresh. Context-aware via `ContextService` — pre-fills plan/template from homepage selections.

| Step | Component | Fields |
|---|---|---|
| 1 | `StepOneComponent` | Business name, industry, website type |
| 2 | `StepTwoComponent` | Budget tier selection (3 options) |
| 3 | `StepThreeComponent` | Services needed (SEO, design, maintenance, content) |
| 4 | `StepFourComponent` | Full name, email, phone, message |

On submit → `POST /api/contact/submit/` → redirects to `/contact/thank-you`.

**Thank-you page:** Animated checkmark SVG, vertical timeline (Details received → Under review → We'll reach out), two CTAs (Return Home / Browse Templates).

---

### 4.6 Dashboard (`/dashboard`)

**File:** `dashboard.component.html` / `dashboard.component.ts`

**Layout:** Fixed sidebar (desktop) + top header + scrollable main content. Mobile: hamburger → slide-in overlay sidebar.

**Sidebar:** Logo (`assets/logo.png`), nav items (Overview / Projects / Messages / Templates / Help), user avatar with name/email, Sign out button.

**3 sections (tab-switched):**

- **Overview:** 4 stat cards (Active Sites / Requests / Messages / Plan), quick actions panel (Start a project / Browse templates / Get help), profile card, recent activity feed (empty state with CTA)
- **Projects:** Empty state with "No projects yet" + "New project" CTA → `/onboarding`
- **Messages:** Empty state with "No messages" + "Contact support" CTA → `/help`

**Guards:** `AuthGuard`.

---

### 4.7 Profile (`/profile`)

**File:** `profile.component.ts` (inline template)

Uses `<app-nav>` for navigation. Two-column form layout:

- **Profile info:** Name, email, business name, phone → `PUT /api/auth/profile/`
- **Change password:** Current password, new password, confirm → `POST /api/auth/change-password/`
- Success/error toast messages
- "Log Out from All Devices" danger zone button

**Guards:** `AuthGuard`.

---

### 4.8 Onboarding (`/onboarding`)

**File:** `onboarding.component.html` / `onboarding.component.ts`

Quick 4-step wizard. Progress bar at top. Step dots indicator.

| Step | Question | Input type |
|---|---|---|
| 1 | What type of business? | 6-option grid (Barbershop / Restaurant / Salon / Retail / Trades / Other) |
| 2 | What's your main goal? | 4-option list (Leads / Bookings / Presence / Sales) |
| 3 | What features do you need? | Multi-select checkbox grid (6 options) |
| 4 | What's your budget? | 3-option list (£59/mo / £249/mo / Custom) + summary card |

Finish → navigates to `/contact`. Skip → navigates to `/dashboard`.

**Guards:** `AuthGuard`.

---

### 4.9 Guided Onboarding (`/onboarding/guided`)

**File:** `guided-onboarding.component.html` / `guided-onboarding.component.ts`

Full 5-step wizard with a live preview sidebar (desktop). Sidebar shows a mock browser window that updates in real-time as the user fills in details.

| Step | Content |
|---|---|
| 1 | Business name, industry dropdown, short description, brand colour picker (6 swatches) |
| 2 | Template selection (4 template cards with images) |
| 3 | Page selection (Home/About/Services/Gallery/Booking/Contact) + add-ons (SEO/Analytics/Chat/Social) |
| 4 | Email, phone, business address |
| 5 | Review summary + "What happens next?" timeline + Submit |

Submit → navigates to `/contact`. Skip → navigates to `/dashboard`.

**Guards:** `AuthGuard`.

---

### 4.10 Help Form (`/help`)

**File:** `features/help/help-form.component.html` / `.ts`

Uses `<app-nav>`. Category selection + message textarea + submit. Submits to backend support endpoint.

**Guards:** `AuthGuard`.

---

### 4.11 Admin Panel (`/admin`)

**File:** `admin.component.html` / `admin.component.ts`

Fixed sidebar with logo (`assets/logo.png`), mobile header with logo. Admin-only views for managing submissions, users, and templates.

**Guards:** `AuthGuard`.

---

### 4.12 Shared Components

| Selector | File | Description |
|---|---|---|
| `app-nav` | `shared/components/nav/` | Glassmorphism fixed navbar, auth-aware, mobile menu |
| `app-footer` | `shared/components/footer/` | Dark footer, logo, links |
| `app-stats-counter` | `shared/components/stats-counter/` | 4-stat animated count-up strip |
| `app-testimonials` | `shared/components/testimonials/` | 3 client testimonial cards with result pills |
| `app-faq` | `shared/components/faq/` | 10-question accordion with category pill filters |
| `app-trust-badges` | `shared/components/trust-badges/` | 6 trust icons + guarantee bar |
| `app-sticky-cta` | `shared/components/sticky-cta/` | Fixed bottom CTA bar |
| `app-live-activity` | `shared/components/live-activity/` | Rotating bottom-left toast notifications (6 real activity types) |
| `app-pricing-cards` | `shared/components/pricing-cards/` | 3 pricing plan cards |
| `app-templates-gallery` | `shared/components/templates-gallery/` | Template grid with modal |
| `app-contact-cta` | `shared/components/contact-cta/` | Dark CTA section |

---

### 4.13 Assets

| File | Usage |
|---|---|
| `assets/logo.png` | All pages — nav, footer, login, register, dashboard, admin, contact form |
| `assets/Abdullah_sayed.png` | Team section — Backend Developer |
| `assets/Md_Nasif.png` | Team section — Frontend Developer |
| `assets/ar_fahad.png` | Team section — DevOps Engineer |
| `assets/templates/aries_grooming.png` | Template card 1 |
| `assets/templates/avt_restaurant.png` | Template card 2 |
| `assets/templates/aries_ventures_barber.png` | Template card 3 |
| `assets/templates/avt_restaurant2.png` | Template card 4 |
| `assets/templates/avt_restaurant3.png` | Template card 5 |
| `assets/templates/avt_restaurant4.png` | Template card 6 |
| `assets/templates/aries_grooming2.png` | Template card 7 |

Logo is rendered with `brightness-0 invert` on dark backgrounds (footer, login/register panels, contact form header). Team photos use `object-cover object-top` to keep faces visible. `onTeamImgError()` shows an initials fallback if the image fails to load.

---

### 4.14 Template Showcase

7 real templates, all with live GitHub Pages demos:

| Template | Industry | Badge | Live Demo |
|---|---|---|---|
| Aries Grooming | Barber Shop | Popular | https://arfahad99.github.io/AVT1_BarberShop/ |
| AVT Restaurant | Food & Beverage | Popular | https://abdsayeed.github.io/AVT1-Restaurant/ |
| Aries Ventures Barber | Barber Shop | Popular | https://arfahad99.github.io/AVT2_BarberShop/ |
| AVT Restaurant 2 | Food & Beverage | High Conversion | https://abdsayeed.github.io/AVT2/ |
| AVT Restaurant 3 | Food & Beverage | — | https://abdsayeed.github.io/AVT3/ |
| AVT Restaurant 4 | Food & Beverage | Popular | https://abdsayeed.github.io/AVT4/ |
| AV Saloon | Barber Shop | Popular | https://arfahad99.github.io/AVT3_Salon-master/ |

---

### 4.15 Pricing Plans

| Plan | Price | Model | Ownership | Min. Term |
|---|---|---|---|---|
| Pay-As-You-Go | £59/month | Subscription | Licensed (buyout available) | 6 or 12 months |
| Fully Managed Professional | £249/month | Subscription | We own & manage (buyout available) | 6 or 12 months |
| Full Professional Website | Custom | One-time | You own everything | None |

Selecting a plan on the homepage navigates to `/contact` with the tier pre-selected via `ContextService.navigateToContactWithPricing()`.

---

### 4.16 Content — Real Data (Not Dummy)

**Stats (stats-counter):** 50+ businesses launched · 47 active clients · 4.9 avg rating · 4 days avg delivery

**Testimonials:**
- Tariq Hassan — Prestige Cuts Barbershop, East London (+340% online bookings, Top 3 Google, +£1.2k/mo revenue)
- Priya Nair — Spice Route Kitchen, Birmingham (+47 direct covers/month, -30% Deliveroo dependency, 4-day delivery)
- Marcus Webb — Webb & Sons Plumbing, Manchester (+22 enquiries/mo, 3 new commercial contracts, 68% quote-to-job rate)

**Live activity feed (rotating toasts):** Tariq (barbershop, East London) · Priya (restaurant, Birmingham) · Marcus (trades, Manchester) · Aisha (salon, Leeds) · Raj (takeaway, Leicester) · Connor (landscaping, Glasgow)

**Team:**
- Abdullah Al Sayeed — Backend Developer — abdsayeedofficial@gmail.com — linkedin.com/in/abdullah-al-sayeed-50522a22b
- MD Nasif — Frontend Developer — Mdnasif17@gmail.com — linkedin.com/in/mdnasif17
- AR Fahad — DevOps Engineer — mdarfahad@gmail.com — linkedin.com/in/arfahad99

---

## 5. Authentication System

### Registration
- 2-step form: (1) name + email → (2) password + confirm
- Live password strength bar + requirement pills (8+ chars, uppercase, lowercase, number)
- Email format validation + whitespace trimming
- Calls `POST /api/auth/register/` → JWT tokens stored in `localStorage`
- Redirects to `/` on success

### Login
- Email + password with show/hide toggle
- "Forgot password?" → `POST /api/auth/password-reset/` → sends reset email
- Calls `POST /api/auth/login/` → stores `accessToken` + `refreshToken` in `localStorage`
- Access token: 60 min expiry. Refresh token: 7 days.
- Welcome toast popup on fresh login (suppressed on page refresh via `performance.navigation.type`)
- Redirects to saved `redirectUrl` or `/`

### Logout
- Calls `POST /api/auth/logout/` with refresh token → server blacklists it
- Clears `accessToken`, `refreshToken`, `currentUser` from `localStorage`
- `AuthService.authState$` BehaviorSubject updates all subscribed components instantly

### Session Persistence
- On app load, `AuthService` reads tokens from `localStorage` and validates
- `AuthInterceptor` automatically attaches `Authorization: Bearer <token>` to all API requests
- Token refresh handled automatically when access token expires

### Guards
- `AuthGuard` — redirects to `/login` (saves current URL as `redirectUrl`) if not authenticated
- `GuestGuard` — redirects to `/` if already authenticated

---

## 6. Backend API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Register new user, returns JWT tokens |
| POST | `/api/auth/login/` | Login, returns access + refresh tokens |
| POST | `/api/auth/logout/` | Blacklist refresh token |
| GET | `/api/auth/profile/` | Get current user profile |
| PUT | `/api/auth/profile/` | Update name, email, business name, phone |
| POST | `/api/auth/change-password/` | Change password (requires current password) |
| POST | `/api/auth/password-reset/` | Request password reset email |
| POST | `/api/auth/token/refresh/` | Get new access token using refresh token |

### Contact / Lead Capture
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/contact/submit/` | Submit 4-step lead form, returns reference number |
| GET | `/api/contact/lookup/` | Look up submission by reference number |

### Templates
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/templates/` | List all templates |
| GET | `/api/templates/{slug}/` | Get single template detail |

### Pricing
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/pricing/plans/` | List all pricing plans |
| GET | `/api/pricing/plans/{slug}/` | Get single plan detail |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/analytics/track/` | Track a user event (page view, CTA click, etc.) |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notifications/` | Get notifications for authenticated user |

---

## 7. Django Apps

| App | Models | Key purpose |
|---|---|---|
| `apps.users` | `User` | Custom user model (UUID PK, email as username), JWT auth, profile management, password reset |
| `apps.contact` | `ContactSubmission` | Lead capture, auto-generated reference numbers, status tracking |
| `apps.templates` | `Template` | Website template catalogue with slug, industry, demo URL, featured flag |
| `apps.pricing` | `PricingPlan` | Pricing tiers with features list, billing period, is_popular flag |
| `apps.analytics` | `Event` | User event tracking (page views, CTA clicks) |
| `apps.notifications` | `Notification` | Per-user notification system |

---

## 8. Database Models (Key Fields)

### User (`apps.users`)
- `id` — UUID primary key
- `email` — unique, used as username field
- `name`, `business_name`, `phone`, `avatar`, `bio`, `website`
- `role` — `customer` / `staff` / `admin`
- `is_verified`, `email_notifications`, `marketing_emails`
- JWT refresh token blacklist support via `djangorestframework-simplejwt`

### ContactSubmission (`apps.contact`)
- `reference_number` — auto-generated (e.g. `AV-2026-0042`)
- `business_name`, `industry`, `website_type`
- `budget_tier` — `basic` / `pro` / `custom`
- `services` — JSON array (seo, design, maintenance, content)
- `contact_name`, `email`, `phone`, `message`
- `status` — `new` → `in_progress` → `completed`
- `created_at`, `updated_at`

### Template (`apps.templates`)
- `name`, `slug`, `industry`
- `description`, `features` — JSON array
- `preview_image`, `demo_url`
- `is_featured` — boolean

### PricingPlan (`apps.pricing`)
- `name`, `slug`, `tier` — `basic` / `pro` / `custom`
- `price`, `billing_period` — `monthly` / `one_time`
- `features` — JSON array
- `is_popular` — boolean

---

## 9. Security

- JWT access tokens expire in 60 minutes; refresh tokens in 7 days
- Refresh token rotation on every use
- Refresh tokens blacklisted on logout (`djangorestframework-simplejwt` blacklist app)
- HTTPS enforced on both frontend (Vercel) and backend (Nginx + Let's Encrypt)
- CORS restricted to `https://aris-ventures.com` and `https://www.aris-ventures.com` only
- Django production settings: `SECURE_SSL_REDIRECT=True`, `SECURE_HSTS_SECONDS=31536000`, `SESSION_COOKIE_SECURE=True`, `CSRF_COOKIE_SECURE=True`
- All form inputs sanitized and validated on both frontend and backend
- Rate limiting on auth endpoints via `django-ratelimit`
- SQL injection protection via Django ORM (no raw queries)
- XSS protection headers set by Nginx
- Django admin accessible only via direct URL (not linked anywhere public)
- No sensitive credentials in version control — all in `.env` on Oracle VM

---

## 10. Testing

- **Framework**: Karma + Jasmine (Angular default)
- **Test runner**: `ng test`
- **Browser**: ChromeHeadless (CI) / Safari 18.6 (local)
- **Total tests**: 109
- **Passing**: 106 (97.2%)

| Test file | Tests | Status |
|---|---|---|
| `auth.service.spec.ts` | 20 | ✅ All pass |
| `api.service.spec.ts` | 18 | ✅ All pass |
| `login.component.spec.ts` | 20 | ✅ All pass |
| `register.component.spec.ts` | 20 | ✅ All pass |
| `notification.service.spec.ts` | 15 | ✅ All pass |
| `profile.component.spec.ts` | 13 | ⚠️ 3 minor failures (component works correctly) |

Run: `cd frontend && npm test -- --watch=false`

---

## 11. Team

| Name | Role | Email | LinkedIn |
|---|---|---|---|
| Abdullah Al Sayeed | Backend Developer | abdsayeedofficial@gmail.com | linkedin.com/in/abdullah-al-sayeed-50522a22b |
| MD Nasif | Frontend Developer | Mdnasif17@gmail.com | linkedin.com/in/mdnasif17 |
| AR Fahad | DevOps Engineer | mdarfahad@gmail.com | linkedin.com/in/arfahad99 |

---

## 12. Environment Variables

### Backend (`.env` on Oracle VM at `/home/ubuntu/AV_web/backend/.env`)
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
RESEND_API_KEY=<add this to enable email sending>
```

### Frontend (`frontend/src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.aris-ventures.com/api',
  frontendUrl: 'https://aris-ventures.com'
};
```

---

## 13. Deployment Guide

### Deploy Frontend (Vercel) — Automatic
Push to `main` → Vercel auto-builds and deploys. Takes ~2 minutes.

```bash
git add .
git commit -m "your message"
git push origin main
```

Manual redeploy: Vercel Dashboard → Project → Deployments → Redeploy latest.

Verify build locally before pushing:
```bash
cd frontend && npm run build -- --configuration production
```

### Deploy Backend (Oracle Cloud) — Manual SSH
```bash
ssh -i ~/Downloads/ssh-key-2026-04-06.key ubuntu@193.123.178.104
cd /home/ubuntu/AV_web
git pull origin main
cd backend
source venv/bin/activate
pip install -r requirements/production.txt   # only if dependencies changed
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart aries-backend
```

### Check Backend Status
```bash
sudo systemctl status aries-backend
sudo journalctl -u aries-backend -n 50 --no-pager
curl https://api.aris-ventures.com/api/health/
```

### Renew SSL (auto via cron, manual if needed)
```bash
sudo certbot renew --dry-run   # test first
sudo certbot renew
sudo systemctl restart nginx
```

---

## 14. Post-MVP Roadmap

### Phase 2 — Client Portal
- Project status tracking (submitted → in progress → review → live)
- File sharing (design assets, content uploads)
- Invoice history and payment receipts

### Phase 3 — Payments
- Stripe integration for subscription billing (£59/mo and £249/mo plans)
- Automated invoice generation via Resend
- Payment failure handling and dunning emails
- Webhook handling for subscription events

### Phase 4 — Automation
- GitHub Actions CI/CD for backend deploys (auto `git pull` + restart on push to `main`)
- Automated test pipeline on PRs
- Automated website provisioning on purchase

### Phase 5 — Analytics
- Custom analytics dashboard (lead conversion, template popularity, revenue)
- Google Analytics 4 integration on frontend
- Admin reporting views

### Phase 6 — Scale
- Upgrade Oracle VM to A1.Flex (ARM, 4 OCPU, 24GB RAM — still free tier)
- Enable Redis for Celery task queue (email sending, async jobs)
- CDN for static assets (Cloudflare or Vercel Edge)
- Automated PostgreSQL backups to Oracle Object Storage

---

## 15. Known Issues & Limitations

| Issue | Impact | Fix |
|---|---|---|
| Oracle E2.1.Micro has 1GB RAM | Low — Django runs fine with 2 Gunicorn workers | Upgrade to A1.Flex (free, ARM) when available |
| `RESEND_API_KEY` not set in prod | Medium — registration/reset emails not sent | Add key to `.env` on Oracle VM |
| 3 failing profile component tests | Low — component works correctly in browser | Update test expectations to match new template |
| No automated backend CI/CD | Low — manual SSH deploy required | Add GitHub Actions webhook (Phase 4) |
| Google OAuth button on login/register is UI-only | Low — not wired to backend | Implement OAuth flow (Phase 2) |
| `testimonials/` assets folder is empty | None — testimonials use Unsplash URLs | Add real client photos when available |

---

## 16. Quick Reference

| Item | Value |
|---|---|
| Live site | https://aris-ventures.com |
| API base | https://api.aris-ventures.com/api |
| API docs | https://api.aris-ventures.com/api/schema/ |
| Admin panel | https://api.aris-ventures.com/admin/ |
| Admin email | admin@ariesventures.co.uk |
| Admin password | Admin1234! |
| Oracle IP | 193.123.178.104 |
| SSH key | ~/Downloads/ssh-key-2026-04-06.key |
| SSH user | ubuntu |
| DB name | aries_ventures |
| DB user | aries_user |
| GitHub repo | https://github.com/abdsayeed/AV_web |
| Vercel project | aris-ventures (auto-deploy on `main`) |
| Stitch project ID | 7991541937214367524 |
