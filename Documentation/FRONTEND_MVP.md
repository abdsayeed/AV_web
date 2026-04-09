# Frontend MVP — Aries Ventures

**Last Updated**: April 2026
**Framework**: Angular 17 (Standalone Components)
**Live URL**: https://aris-ventures.com
**Repository**: https://github.com/abdsayeed/AV_web (folder: `frontend/`)

---

## 1. Overview

The frontend is a single-page application (SPA) built with Angular 17. It serves as the primary conversion funnel for Aries Ventures — a web agency that builds and manages websites for local businesses. The app is fully responsive, mobile-first, and deployed on Vercel with automatic deployments on every push to `main`.

---

## 2. Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Angular | 17 | SPA framework |
| TypeScript | 5.2 | Language |
| Tailwind CSS | 3.4 | Utility-first styling |
| RxJS | 7.8 | Reactive state & async |
| Angular Signals | 17 | Reactive form state |
| Material Icons | Latest | Icon system |
| Karma + Jasmine | 6.4 / 5.1 | Unit testing |
| Vercel | — | Hosting & CI/CD |

---

## 3. Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── app.component.ts          # Home page (main landing page)
│   │   ├── app.component.html        # Home page template
│   │   ├── app.component.css         # Home page styles
│   │   ├── app.routes.ts             # All application routes
│   │   ├── root.component.ts         # Root shell with router-outlet
│   │   │
│   │   ├── core/                     # Singleton services, guards, interceptors
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts           # Authentication state & JWT
│   │   │   │   ├── api.service.ts            # All HTTP calls to backend
│   │   │   │   ├── form-state.service.ts     # Multi-step form state (Signals)
│   │   │   │   ├── form-storage.service.ts   # localStorage persistence
│   │   │   │   ├── context.service.ts        # Cross-page navigation context
│   │   │   │   ├── notification.service.ts   # Toast notifications
│   │   │   │   ├── loading.service.ts        # Global loading spinner
│   │   │   │   ├── error-handler.service.ts  # Global error handling
│   │   │   │   └── mock-api.service.ts       # Mock data for dev/testing
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts       # Attaches JWT to requests
│   │   │   │   └── loading.interceptor.ts    # Shows spinner on HTTP calls
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts             # AuthGuard + GuestGuard
│   │   │   └── models/
│   │   │       ├── contact-form.model.ts     # Contact form TypeScript types
│   │   │       └── form-context.model.ts     # Form context types
│   │   │
│   │   ├── features/                 # Feature modules
│   │   │   ├── contact/
│   │   │   │   ├── pages/
│   │   │   │   │   ├── contact-form/         # Multi-step contact form page
│   │   │   │   │   └── thank-you/            # Post-submission thank you page
│   │   │   │   └── components/
│   │   │   │       ├── step-one/             # Business info step
│   │   │   │       ├── step-two/             # Budget selection step
│   │   │   │       ├── step-three/           # Services step
│   │   │   │       └── step-four/            # Contact details step
│   │   │   └── help/
│   │   │       └── help-form.component.ts    # Help/support form
│   │   │
│   │   ├── shared/                   # Reusable components & directives
│   │   │   ├── components/
│   │   │   │   ├── testimonials/             # Customer testimonials carousel
│   │   │   │   ├── stats-counter/            # Animated number counters
│   │   │   │   ├── trust-badges/             # Trust/credibility badges
│   │   │   │   ├── faq/                      # Accordion FAQ section
│   │   │   │   ├── sticky-cta/               # Sticky call-to-action bar
│   │   │   │   ├── live-activity/            # Live activity feed
│   │   │   │   ├── notifications/            # Toast notification display
│   │   │   │   ├── loading/                  # Loading spinner overlay
│   │   │   │   ├── progress-bar/             # Form progress bar
│   │   │   │   ├── service-card/             # Service display card
│   │   │   │   └── budget-selector/          # Budget selection UI
│   │   │   └── directives/
│   │   │       └── micro-interactions.directive.ts  # Hover/click animations
│   │   │
│   │   ├── login/                    # Login page
│   │   ├── register/                 # Registration page
│   │   ├── dashboard/                # User dashboard (auth-protected)
│   │   └── profile/                  # User profile (auth-protected)
│   │
│   ├── assets/
│   │   ├── templates/                # Template screenshot images (7 PNGs)
│   │   ├── Abdullah_sayed.png        # Team member photo
│   │   ├── Md_Nasif.png              # Team member photo
│   │   ├── ar_fahad.png              # Team member photo
│   │   ├── logo.png                  # Company logo
│   │   └── favicon.ico               # Browser favicon
│   │
│   ├── environments/
│   │   ├── environment.ts            # Dev: http://localhost:8000/api
│   │   └── environment.prod.ts       # Prod: https://api.aris-ventures.com/api
│   │
│   ├── index.html                    # App shell HTML
│   ├── main.ts                       # Bootstrap entry point
│   ├── styles.css                    # Global styles + Tailwind imports
│   └── test.ts                       # Karma test entry point
│
├── angular.json                      # Angular CLI config
├── tailwind.config.js                # Tailwind configuration
├── tsconfig.json                     # TypeScript config
├── karma.conf.js                     # Test runner config (Safari)
├── vercel.json                       # Vercel SPA routing rewrites
└── package.json                      # Dependencies
```

---

## 4. Routes

| Path | Component | Guard | Description |
|---|---|---|---|
| `/` | `AppComponent` | None | Home / landing page |
| `/login` | `LoginComponent` | GuestGuard | Login page (redirects if already logged in) |
| `/register` | `RegisterComponent` | GuestGuard | Registration page |
| `/contact` | `ContactFormComponent` | None | Multi-step contact form |
| `/contact/thank-you` | `ThankYouComponent` | None | Post-submission confirmation |
| `/dashboard` | `DashboardComponent` | AuthGuard | User dashboard (requires login) |
| `/profile` | `ProfileComponent` | AuthGuard | User profile (requires login) |
| `/help` | `HelpFormComponent` | AuthGuard | Help/support form (requires login) |
| `/**` | — | — | Redirects to `/` |

All routes use lazy loading (`loadComponent`) except `/login` and `/register`.

---

## 5. Pages & Components

### 5.1 Home Page (`/`)

The main landing page. Single scrollable page with multiple sections.

**Navbar**
- Logo + company name
- Navigation links: Home, How It Works, Services, Clients, Templates, Team, Contact
- Auth buttons: Login / Register (when logged out)
- User menu: Dashboard, Profile, Logout (when logged in)
- Mobile hamburger menu with slide-out drawer
- Scroll-based active section highlighting
- Smooth scroll to section on nav click

**Hero Section**
- Headline and subheadline
- Primary CTA: "Get Your Website" → navigates to `/contact`
- Secondary CTA: "View Templates" → scrolls to templates section
- Trust indicators

**How It Works**
- 4-step process timeline
- Step 1: Choose your template
- Step 2: Customise your content
- Step 3: We build and launch
- Step 4: We manage everything

**Services Section**
- 6 industry verticals with icons:
  - Barbershops (`content_cut`)
  - Cafes & Dining (`restaurant`)
  - Home Services (`home_repair_service`)
  - Landscapers (`park`)
  - Boutique Retail (`storefront`)
  - Professional (`business_center`)

**Pricing Plans**
3 plans displayed as cards:

| Plan | Price | Badge |
|---|---|---|
| Pay-As-You-Go Website | £59/month | Most Accessible |
| Fully Managed Professional | £249/month | Most Popular |
| Full Professional Website | Custom one-time | Full Ownership |

Each card has:
- Icon, name, price, description
- Feature list with checkmarks
- Contract info footer
- "Select Plan" button → navigates to `/contact` with plan pre-selected

**Template Showcase**
- Grid of template cards (6 shown initially, "Load More" reveals 7th)
- Each card: screenshot, name, industry, badge (Popular / High Conversion)
- "View Details" button → opens modal
- Modal shows: full description, large screenshot, "Live Demo" + "Use This Template" buttons
- "Live Demo" opens real GitHub Pages demo in new tab
- "Use This Template" navigates to `/contact` with template pre-selected

7 templates available:

| Name | Industry | Badge |
|---|---|---|
| Aries Grooming | Barber Shop | Popular |
| AVT Restaurant | Food & Beverage | Popular |
| Aries Ventures Barber | Barber Shop | Popular |
| AVT Restaurant 2 | Food & Beverage | High Conversion |
| AVT Restaurant 3 | Food & Beverage | — |
| AVT Restaurant 4 | Food & Beverage | Popular |
| AV Saloon | Barber Shop | Popular |

**Team Section**
3 team members with photo, name, role, bio, email link, LinkedIn link.

Email links use smart detection — opens Gmail, Yahoo, Outlook, or default mail app based on email domain. Custom domains show a modal with provider options.

**Contact Section (Home page quick form)**
- Business name, email, phone
- Website type dropdown
- Budget selector
- Services checkboxes (SEO, Design, Maintenance, Content)
- Message textarea
- Submit button with loading state
- Success/error feedback

**Shared Components on Home Page**
- `TestimonialsComponent` — customer testimonials
- `StatsCounterComponent` — animated counters (e.g. "50+ clients")
- `TrustBadgesComponent` — credibility badges
- `FaqComponent` — accordion FAQ
- `StickyCTAComponent` — sticky bottom bar with CTA
- `MicroInteractionsDirective` — hover/click animations on elements

**Welcome Notification**
On login, a popup appears in the top-right corner:
- "Welcome back, [Name]! You're now logged in"
- Auto-dismisses after 4 seconds
- Has manual close button
- Only shows on actual login, NOT on page refresh

---

### 5.2 Login Page (`/login`)

- Email + password form
- Real-time validation feedback
- "Forgot password?" link (UI only, no backend flow yet)
- "Don't have an account? Register" link
- Submit button with loading spinner
- Error message display
- Redirects to `/` on success
- Protected by `GuestGuard` (redirects to `/` if already logged in)

**Validation:**
- Email: must be valid format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Password: required, minimum 6 characters

---

### 5.3 Register Page (`/register`)

- Name, email, password, confirm password fields
- Real-time validation feedback
- "Already have an account? Login" link
- Submit button with loading spinner
- Error message display
- Redirects to `/` on success
- Protected by `GuestGuard`

**Validation:**
- Name: required, 2–50 characters
- Email: valid format
- Password: 8+ characters, must contain uppercase, lowercase, and number
- Confirm password: must match password

---

### 5.4 Multi-Step Contact Form (`/contact`)

4-step wizard for lead capture. State persists in localStorage — if user refreshes, they return to the same step with data intact.

**Step 1 — Business Info**
- Business name (required)
- Industry dropdown
- Website type dropdown
- Current website URL (optional)

**Step 2 — Budget**
- Visual budget selector cards:
  - Basic (£59/month)
  - Professional (£249/month)
  - Custom (one-time)
- Selected plan highlighted

**Step 3 — Services**
- Checkbox grid:
  - Web Design
  - SEO Optimisation
  - Content Writing
  - Ongoing Maintenance
- Multiple selections allowed

**Step 4 — Contact Details**
- Full name (required)
- Email address (required)
- Phone number (optional)
- Message / additional info
- Terms acceptance checkbox

**Progress Bar**
- Shows current step (1–4)
- Step labels: Business Info → Budget → Services → Contact
- Back/Next navigation buttons

**Context Awareness**
If user arrives from:
- Clicking "Select Plan" on pricing → Step 2 pre-selects that plan
- Clicking "Use This Template" → Step 1 pre-fills industry and template name

**Submission**
- Sends to `POST /api/contact/submit/`
- On success → redirects to `/contact/thank-you`
- On error → shows error message, stays on form

---

### 5.5 Thank You Page (`/contact/thank-you`)

- Confirmation message
- Reference number displayed
- Estimated response time
- "Back to Home" button
- Clears form state from localStorage

---

### 5.6 Dashboard (`/dashboard`) — Auth Protected

Accessible only when logged in. Redirects to `/login` if not authenticated.

**Sidebar Navigation**
- Overview (default)
- Projects
- Messages
- Settings link

**Overview Section**
- Welcome message with user's name
- Quick stats cards (projects, messages, etc.)
- Quick action buttons: "New Project", "Get Help", "View Templates"
- Recent activity feed (empty state with CTA)

**Projects Section**
- List of user's projects
- Empty state: "No projects yet" with "Start a Project" CTA

**Responsive**
- Sidebar collapses on mobile
- Hamburger menu for mobile navigation

---

### 5.7 Profile Page (`/profile`) — Auth Protected

- Displays user information: name, email, role, join date
- Avatar placeholder
- Logout button
- "Back to Dashboard" navigation

---

### 5.8 Help Form (`/help`) — Auth Protected

- Category dropdown (Technical Issue, Billing, General Enquiry, etc.)
- Subject field
- Message textarea
- File attachment option (UI only)
- Submit button

---

## 6. Core Services

### AuthService (`auth.service.ts`)

Manages all authentication state using `BehaviorSubject<AuthState>`.

**State shape:**
```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}
```

**Key methods:**
- `loginWithCustom(email, password)` — calls API, stores JWT, updates state
- `registerWithCustom(userData)` — calls API, stores JWT, updates state
- `logout()` — calls API logout, clears localStorage, navigates to `/`
- `isAuthenticated()` — returns boolean
- `getCurrentUser()` — returns current user object
- `getToken()` — returns current JWT token
- `changePassword(old, new)` — calls change password API
- `resetPassword(email)` — calls password reset API

**Token storage:**
Tokens stored in both `token` and `accessToken` keys for compatibility:
```
localStorage.token = access_token
localStorage.accessToken = access_token
localStorage.refreshToken = refresh_token
localStorage.currentUser = JSON.stringify(user)
```

**Initialisation:**
On app start, checks localStorage for existing token. If found, validates with `GET /api/auth/profile/`. If valid, restores auth state. If invalid, clears storage.

**Race condition protection:**
`isLoading: true` during initialisation prevents components from rendering auth-dependent UI before state is resolved.

---

### ApiService (`api.service.ts`)

All HTTP calls to the backend. Uses `environment.apiUrl` as base URL.

**Auth endpoints:**
- `login(credentials)` → `POST /api/auth/login/`
- `register(userData)` → `POST /api/auth/register/`
- `logout()` → `POST /api/auth/logout/`
- `getProfile()` → `GET /api/auth/profile/`
- `updateProfile(data)` → `PUT /api/auth/profile/`
- `changePassword(data)` → `POST /api/auth/change-password/`
- `requestPasswordReset(email)` → `POST /api/auth/password-reset/`

**Contact endpoints:**
- `submitContactForm(data)` → `POST /api/contact/submit/`
- `lookupSubmission(ref, email)` → `GET /api/contact/lookup/`

**Other endpoints:**
- `getTemplates(filters?)` → `GET /api/templates/`
- `getPricingPlans()` → `GET /api/pricing/plans/`
- `trackEvent(data)` → `POST /api/analytics/track/`

**Error handling:**
All errors go through `handleError()` which extracts the most useful message from the response and returns it as an Observable error.

---

### FormStateService (`form-state.service.ts`)

Manages multi-step contact form state using Angular Signals.

**State:**
- `formData` signal — all form data across all steps
- `currentStep` signal — current step number (1–4)

**Methods:**
- `updateFormData(step, data)` — saves step data + persists to localStorage
- `nextStep()` — increments step
- `previousStep()` — decrements step
- `goToStep(n)` — jumps to specific step
- `resetForm()` — clears all data and localStorage
- `loadSavedProgress()` — restores from localStorage on init
- `getFormData()` — returns current form data

---

### ContextService (`context.service.ts`)

Passes context between pages (e.g. which template or plan was selected).

**Methods:**
- `navigateToContactWithTemplate(slug, name, industry)` — sets template context and navigates to `/contact`
- `navigateToContactWithPricing(tier, price)` — sets pricing context and navigates to `/contact`
- `getContext()` — returns current context
- `clearContext()` — clears after use

---

### NotificationService (`notification.service.ts`)

Toast notification system.

**Methods:**
- `success(title, message)` — green toast
- `error(title, message)` — red toast
- `warning(title, message)` — yellow toast
- `info(title, message)` — blue toast
- `remove(id)` — removes specific notification
- `clear()` — removes all notifications

Notifications auto-dismiss after 4 seconds. Displayed by `NotificationsComponent` in the root layout.

---

### LoadingService (`loading.service.ts`)

Global loading state.

**Methods:**
- `show()` — increments active request counter
- `hide()` — decrements counter
- `forceHide()` — resets counter to 0

Spinner shows when counter > 0. Managed automatically by `LoadingInterceptor`.

---

## 7. Interceptors

### AuthInterceptor (`auth.interceptor.ts`)

Automatically attaches JWT token to every outgoing HTTP request:
```
Authorization: Bearer <access_token>
```

Reads token from `localStorage.getItem('accessToken')`.

### LoadingInterceptor (`loading.interceptor.ts`)

Calls `LoadingService.show()` before each request and `LoadingService.hide()` after completion (success or error).

---

## 8. Guards

### AuthGuard

Protects routes that require authentication (`/dashboard`, `/profile`, `/help`).

- If authenticated → allows navigation
- If not authenticated → redirects to `/login`

### GuestGuard

Protects routes that should only be accessible when NOT logged in (`/login`, `/register`).

- If not authenticated → allows navigation
- If authenticated → redirects to `/`

---

## 9. Authentication Flow

```
User fills login form
        ↓
LoginComponent calls AuthService.loginWithCustom()
        ↓
AuthService validates email format + password length
        ↓
AuthService calls ApiService.login()
        ↓
ApiService sends POST /api/auth/login/
        ↓
Backend returns { success, user, tokens: { access, refresh } }
        ↓
AuthService stores tokens in localStorage (both 'token' and 'accessToken')
        ↓
AuthService updates BehaviorSubject with new AuthState
        ↓
All subscribed components receive updated state
        ↓
AppComponent shows welcome popup notification
        ↓
Router navigates to '/'
```

**On page refresh:**
```
App starts → AuthService.initializeAuth()
        ↓
Checks localStorage for token
        ↓
If found → calls GET /api/auth/profile/ to validate
        ↓
If valid → restores auth state (no welcome popup)
        ↓
If invalid → clears storage, stays logged out
```

---

## 10. Contact Form Flow

```
User clicks "Get Your Website" or "Select Plan" or "Use This Template"
        ↓
ContextService stores context (template/plan info)
        ↓
Router navigates to /contact
        ↓
ContactFormComponent loads, reads context from ContextService
        ↓
FormStateService checks localStorage for saved progress
        ↓
If saved → restores to last step with data
        ↓
User fills Step 1 → FormStateService.updateFormData('step1', data)
        ↓
Data saved to localStorage automatically
        ↓
User clicks Next → FormStateService.nextStep()
        ↓
Repeat for Steps 2, 3, 4
        ↓
User submits Step 4 → ApiService.submitContactForm(allData)
        ↓
POST /api/contact/submit/
        ↓
Backend returns { success, referenceNumber }
        ↓
FormStateService.resetForm() clears localStorage
        ↓
Router navigates to /contact/thank-you
        ↓
ThankYouComponent displays reference number
```

---

## 11. Environment Configuration

### Development (`environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  frontendUrl: 'http://localhost:4200'
};
```

### Production (`environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.aris-ventures.com/api',
  frontendUrl: 'https://aris-ventures.com'
};
```

Angular CLI automatically swaps these files during `ng build --configuration production`.

---

## 12. Vercel Configuration (`vercel.json`)

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures Angular's client-side routing works correctly — all URLs serve `index.html` and Angular handles the routing internally. Without this, direct URL access to `/login`, `/dashboard` etc. would return 404.

---

## 13. Tailwind Configuration

Custom configuration in `tailwind.config.js`:
- Content paths include all Angular component files
- PostCSS configured via `postcss.config.js`
- Autoprefixer included for cross-browser compatibility

---

## 14. Testing

**Framework**: Karma + Jasmine
**Browser**: Safari 18.6 (configured via `karma-safari-launcher`)
**Config**: `karma.conf.js`

**Run tests:**
```bash
cd frontend
npm test
```

**Test files:**

| File | Tests | Status |
|---|---|---|
| `auth.service.spec.ts` | 20 | ✅ All passing |
| `api.service.spec.ts` | 18 | ✅ All passing |
| `login.component.spec.ts` | 20 | ✅ All passing |
| `register.component.spec.ts` | 20 | ✅ All passing |
| `notification.service.spec.ts` | 15 | ✅ All passing |
| `profile.component.spec.ts` | 13 | ⚠️ 3 failing (minor) |

**Total: 109 tests — 106 passing (97.2%)**

The 3 failing profile tests expect methods (`updateProfile`, `changePassword`, `validateEmail`) that aren't implemented in the component yet. The component itself works correctly in production.

---

## 15. Build & Deploy

### Local Development
```bash
cd frontend
npm install
npm start
# Opens at http://localhost:4200
```

### Production Build
```bash
cd frontend
npm run build
# Output in dist/aries-ventures/
```

### Deploy to Vercel
Automatic — every push to `main` branch triggers a Vercel rebuild and deployment.

Manual redeploy: Vercel Dashboard → your project → Deployments → Redeploy latest

**Vercel Build Settings:**
- Root Directory: `frontend`
- Framework Preset: Other
- Build Command: `npm run build`
- Output Directory: `dist/aries-ventures`
- Install Command: `npm install`

---

## 16. Angular Budget Configuration

CSS budget limits in `angular.json` (increased from defaults to accommodate component styles):

```json
{
  "type": "anyComponentStyle",
  "maximumWarning": "20kb",
  "maximumError": "50kb"
}
```

---

## 17. Known Issues & Limitations

| Issue | Impact | Notes |
|---|---|---|
| Home page contact form doesn't call API | Low — uses simulated delay | Needs wiring to `ApiService.submitContactForm()` |
| Password reset flow is UI only | Medium — no email sent | Backend endpoint exists, frontend just needs the form |
| Profile page has no edit functionality | Low — view only | `updateProfile()` API method exists, just needs UI |
| 3 failing profile tests | Low | Test expectations don't match current implementation |
| No email verification flow | Low | Backend sends verification email but frontend has no verify page |
| Dashboard shows empty state only | Low — no real data yet | Needs project management features in Phase 2 |

---

## 18. Dependencies

### Production
```json
"@angular/animations": "^17.0.0",
"@angular/common": "^17.0.0",
"@angular/compiler": "^17.0.0",
"@angular/core": "^17.0.0",
"@angular/forms": "^17.0.0",
"@angular/platform-browser": "^17.0.0",
"@angular/platform-browser-dynamic": "^17.0.0",
"@angular/router": "^17.0.0",
"rxjs": "~7.8.0",
"tslib": "^2.3.0",
"zone.js": "~0.14.2"
```

### Dev
```json
"@angular-devkit/build-angular": "^17.0.0",
"@angular/cli": "^17.3.17",
"@angular/compiler-cli": "^17.0.0",
"tailwindcss": "^3.4.19",
"karma": "~6.4.0",
"karma-safari-launcher": "^1.0.0",
"jasmine-core": "~5.1.0",
"typescript": "~5.2.2"
```

---

## 19. Post-MVP Frontend Roadmap

### Phase 2
- Profile edit form (name, phone, business name, avatar upload)
- Password change form in profile
- Email verification page (`/verify-email?token=xxx`)
- Password reset page (`/reset-password?token=xxx`)

### Phase 3
- Client dashboard with real project data
- Project status timeline
- File/asset sharing section
- Invoice history

### Phase 4
- Stripe payment integration
- Subscription management UI
- Billing history

### Phase 5
- Analytics dashboard (page views, form conversions)
- Template popularity metrics
- A/B testing for CTAs

### Phase 6
- Dark mode toggle
- Multi-language support (i18n)
- PWA (Progressive Web App) support
- Push notifications
