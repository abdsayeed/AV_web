Aries Ventures — All Pages Design Prompt
Context
You are a senior frontend engineer embedded in the Aries Ventures design system. Every page you build must conform strictly to the "Structured Fluidity" design language. No custom colours. No new fonts. No sharp corners. No 1px borders. Every surface shift is tonal. Every button is rounded-full. Every reveal is cinematic.
Stack: Angular 17 standalone components · Tailwind CSS (MD3 tokens) · IntersectionObserver animations · No third-party animation libraries

Design System (Apply to Every Page — No Exceptions)
Colours
TokenHexprimary#000101primary-container#1a1c1eon-primary#ffffffsecondary#0058besecondary-container#2170e4secondary-fixed#d8e2ffon-secondary-fixed#001a42surface#f8f9fasurface-container-lowest#ffffffsurface-container-low#f3f4f5surface-container#edeeefsurface-container-high#e7e8e9surface-container-highest#e1e3e4on-surface#191c1don-surface-variant#44474aoutline-variant#c5c6caerror#ba1a1a
Typography
RoleFontHeadlinesPlus Jakarta SansBody / UIInterData / Labels / MonoJetBrains Mono
Radius

Buttons → rounded-full (always, no exceptions)
Cards, modals, large containers → rounded-3xl
Inner card elements → rounded-2xl
Inputs, pills, small elements → rounded-xl

Rules

No 1px borders — use tonal surface shifts to define section boundaries
Ghost borders only — border-outline-variant/10 to border-outline-variant/20 max
Glassmorphism navbar — backdrop-blur-xl bg-surface/80
Ambient shadows — blur-[120px] gradient orbs at 15–30% opacity, never hard drop-shadows
Cinematic reveals — .cinematic-reveal class: opacity-0 translate-y-6 → opacity-100 translate-y-0, transition-all duration-700 ease-out, triggered via IntersectionObserver in ngAfterViewInit
Card hover — scale-[1.02] transition-transform duration-300 ease-out
Dark sections — bg-primary-container text-on-primary only, never raw #000
All animations — pure CSS + TypeScript IntersectionObserver. No GSAP, no Angular animations module.


Pages to Build

PAGE 1 — /contact — Multi-Step Lead Form
Goal: Capture leads from SMB owners (barbershops, restaurants, salons). Feel premium — like booking a consultation at an agency, not filling a government form.
Layout:

Split screen: left panel (40%) dark bg-primary-container with brand messaging, ambient secondary blue blob, rotating testimonial quote, trust badges. Right panel (60%) light bg-surface-container-lowest with the form.
Left panel stays fixed while the right panel scrolls through steps.

4-Step Form:
Step 1 — Business Info

Business name (text input)
Industry (pill selector — not a dropdown): Barber · Restaurant · Salon · Gym · Clinic · Retail · Other. Selected pill → bg-secondary text-on-primary rounded-full. Unselected → bg-surface-container border-outline-variant/15 rounded-full
Website type (3 cards): Template-based · Custom Design · Not Sure. Cards → rounded-3xl, selected state gets ring-2 ring-secondary

Step 2 — Budget

4 budget tier cards in a 2×2 grid: £0–£500 · £500–£1,500 · £1,500–£5,000 · £5,000+
Each card → rounded-3xl bg-surface-container-lowest, selected → ring-2 ring-secondary bg-secondary-fixed
Small descriptive line under each (e.g. "Great for template plans", "Custom design territory")
Pre-selects if user arrived from /pricing with ?plan= query param

Step 3 — Services

Multi-select pill grid: Website Design · SEO · Monthly Maintenance · Content Writing · Branding · Photography
Selected → bg-secondary-fixed text-on-secondary-fixed rounded-full
Unselected → bg-surface-container rounded-full border-outline-variant/15

Step 4 — Contact Details

Full name · Email · Phone (optional) · Message (textarea)
All inputs → rounded-xl bg-surface-container border-outline-variant/15 focus:ring-2 focus:ring-secondary
Submit CTA → bg-secondary text-on-primary rounded-full w-full py-4 font-semibold

Progress Bar:

Thin bar at top of right panel using bg-secondary, animated width transition
Step labels below: "Business · Budget · Services · Contact"
Current step label bold, others text-on-surface-variant

Context awareness:

If ?plan=pay-as-you-go → pre-select £0–£500 budget tier + Template-based website type
If ?plan=managed → pre-select £500–£1,500 + Custom Design
If ?template=<slug> → show a small "Using: [Template Name]" pill at top of form in bg-secondary-fixed text-on-secondary-fixed

Form state: Persist all values to localStorage key av_contact_form. Restore on page load.
API: POST /api/contact/submit/ with JWT header if logged in. On success → navigate to /contact/thank-you.

PAGE 2 — /contact/thank-you — Submission Confirmation
Goal: Delight the user. Make them feel they made the right call.
Layout: Full-screen centred, bg-surface. Single card rounded-3xl bg-surface-container-lowest max-width 560px.
Content:

Large animated checkmark SVG (draws itself with stroke-dashoffset CSS animation on page load, stroke: secondary)
Headline: "You're in. We'll be in touch."
Sub-line: "Your reference number" → display in font-mono bg-surface-container rounded-xl px-4 py-2 with a copy-to-clipboard icon button
Timeline strip: 3 steps — "We review your brief (24hrs)" · "Discovery call booked" · "Build begins". Each step → numbered pill in bg-secondary-fixed text-on-secondary-fixed, connected by a dashed line in border-outline-variant/30
Two CTAs: "Browse our templates →" (bg-secondary text-on-primary rounded-full) · "Back to home" (ghost border-outline-variant/20 text-on-surface rounded-full)
Below cards: 3 micro-trust badges — "Avg. delivery 3–5 days" · "No lock-in on first month" · "Dedicated account manager"
Auto-clear av_contact_form from localStorage on this page load


PAGE 3 — /login — User Login
Goal: Fast, trustworthy. A logged-in returning client should feel welcomed back.
Layout: Split — left 45% dark bg-primary-container, right 55% bg-surface-container-lowest.
Left panel:

Aries Ventures wordmark (Plus Jakarta Sans, bold, text-on-primary)
Tagline: "Your business, live in days."
3 social proof lines with checkmark icons: "109 businesses launched" · "Avg. 4.9★ satisfaction" · "3–5 day delivery"
Ambient secondary blue blob blur-[100px] opacity-20 in the bottom-left corner
Footer of panel: "New here? [Create an account →]" in text-on-primary/60 with text-secondary link

Right panel:

"Welcome back" headline (Plus Jakarta Sans, text-on-surface)
Email input + Password input → rounded-xl bg-surface-container border-outline-variant/15 focus:ring-2 focus:ring-secondary
"Forgot password?" link → text-secondary text-sm aligned right above the input
Login CTA → bg-secondary text-on-primary rounded-full w-full py-4 font-semibold
Divider: — or — in text-on-surface-variant
Google OAuth button → bg-surface-container-lowest border border-outline-variant/20 rounded-full with Google logo SVG inline
Error state: bg-error/10 text-error rounded-xl px-4 py-3 notification block above the form

API: POST /api/auth/login/ → store JWT in localStorage → trigger welcome toast via NotificationService → navigate to /dashboard

PAGE 4 — /register — User Registration
Goal: Low friction. Two steps so it doesn't feel overwhelming.
Layout: Same split as login — left panel identical branding, right panel is the 2-step form.
Left panel: Same as login. Change footer link to "Already have an account? [Sign in →]"
Right panel — Step 1: Personal Info

"Create your account" headline
Full name · Email
Both → rounded-xl bg-surface-container border-outline-variant/15 focus:ring-2 focus:ring-secondary
"Continue →" CTA → bg-secondary text-on-primary rounded-full w-full py-4
Step indicator: 2 dots — filled bg-secondary for current, bg-surface-container-high for upcoming

Right panel — Step 2: Set Password

"Almost there." headline
Password field with show/hide toggle (eye icon button inside input, text-on-surface-variant)
Confirm password field
Password strength bar: 4 segments, animated fill left-to-right as user types. Colours: bg-error (weak) → bg-yellow-500 (fair) → bg-secondary (strong). Rules displayed as pill checklist: "8+ chars" · "Uppercase" · "Lowercase" · "Number". Each pill → bg-surface-container rounded-full text-xs. Met → bg-secondary-fixed text-on-secondary-fixed
"Create account" CTA → bg-secondary text-on-primary rounded-full w-full py-4

API: POST /api/auth/register/ → store JWT → welcome toast → navigate to /onboarding

PAGE 5 — /dashboard — Client Dashboard
Goal: Give returning clients an instant overview of their project status. Feel like a premium agency client portal.
Layout: Fixed sidebar (left 240px) + scrollable main content area.
Sidebar:

Aries Ventures logo mark (just the "AV" monogram, font-headline font-bold text-xl)
Nav items: Overview · Projects · Messages · Settings. Active item → bg-secondary-fixed text-on-secondary-fixed rounded-xl px-4 py-2. Inactive → text-on-surface-variant hover:bg-surface-container-high rounded-xl
Bottom of sidebar: User avatar initials circle (bg-secondary-fixed text-on-secondary-fixed rounded-full) + name + "Logout" button (ghost text-on-surface-variant)
Sidebar bg → bg-surface-container-lowest border-r border-outline-variant/10

Main — Overview Tab:
Stats row (4 cards, rounded-3xl bg-surface-container-lowest):

Active Projects · Messages Unread · Days to Next Delivery · Subscription Plan

Below stats — 2-column grid:
Left: "Your Projects" card (rounded-3xl bg-surface-container-lowest)

If no projects → empty state: illustration (simple SVG of a browser window with a plus sign, stroke-secondary), "No projects yet", "Get started →" CTA bg-secondary text-on-primary rounded-full
If projects exist → list of project rows: favicon/template thumbnail + project name + status pill (bg-secondary-fixed text-on-secondary-fixed rounded-full for Active, bg-surface-container-high text-on-surface-variant for Pending) + "View →" ghost button

Right: "Recent Activity" feed (rounded-3xl bg-surface-container-lowest)

Timeline of events: e.g. "Design draft uploaded" · "Contract signed" · "Payment received"
Each entry: small dot in bg-secondary rounded-full + timestamp in font-mono text-xs text-on-surface-variant + description
Vertical dashed connector between entries border-outline-variant/30

Quick Actions strip (below the 2-col grid): 3 ghost pill buttons: "Request a change" · "Download invoice" · "Contact your manager" → all border-outline-variant/15 text-on-surface rounded-full hover:bg-surface-container-high
Main — Projects Tab: Full list of project cards. Each card rounded-3xl with: template screenshot thumbnail on left, project name + industry + status on right, progress bar in bg-secondary, and "View details" CTA.
Main — Messages Tab: Simple thread list. Each thread row → sender avatar + preview text + timestamp. Selected thread → bg-secondary-fixed/30 highlight. Unread → font-semibold. Read → text-on-surface-variant.

PAGE 6 — /profile — User Profile
Goal: Clean, low-clutter. Users edit their info and move on.
Layout: Centred single-column, max-width 680px, bg-surface.
Top card (rounded-3xl bg-surface-container-lowest):

Avatar initials circle (large, 80px, bg-secondary-fixed text-on-secondary-fixed text-3xl font-bold rounded-full) centred at top
Name + email + role badge (bg-surface-container-high text-on-surface-variant rounded-full text-xs font-mono px-3 py-1) below avatar
Edit profile button → bg-secondary text-on-primary rounded-full

Edit Form card (rounded-3xl bg-surface-container-lowest below):

Fields: Full name · Email · Business name · Phone
All inputs → rounded-xl bg-surface-container border-outline-variant/15 focus:ring-2 focus:ring-secondary
Save button → bg-secondary text-on-primary rounded-full
Success: NotificationService success toast. No inline flash messages.

Change Password card (rounded-3xl bg-surface-container-lowest):

Current password · New password · Confirm new password
Same input style. Password strength bar (same as Register page).
Update button → bg-secondary text-on-primary rounded-full
API: POST /api/auth/change-password/

Danger Zone card (rounded-3xl bg-surface-container-lowest border border-error/20):

"Logout from all devices" → ghost border-error/30 text-error rounded-full button
POST /api/auth/logout/ → clear localStorage → navigate to /


PAGE 7 — /onboarding — Quick Onboarding Wizard
Goal: After registration, guide new users to their first project enquiry in under 2 minutes. High energy. Celebratory.
Layout: Full screen bg-surface. Centred card rounded-3xl bg-surface-container-lowest max-width 640px. Large step progress dots at top.
Step 1 — Business Type

Headline: "What kind of business are you?"
6 large icon cards in a 3×2 grid: Barber · Restaurant · Salon · Gym · Clinic · Other
Each card rounded-3xl bg-surface-container-low hover:bg-surface-container-high, selected → ring-2 ring-secondary bg-secondary-fixed
Icon above label. Large, generous padding.

Step 2 — Primary Goal

Headline: "What's your main goal right now?"
3 cards (full width, stacked): "Get online fast" · "Replace an old website" · "Launch a new brand"
Each card rounded-3xl bg-surface-container-low, selected → ring-2 ring-secondary
Short descriptor under each label in text-on-surface-variant text-sm

Step 3 — Features Needed

Headline: "What do you need?"
Multi-select pill grid (same style as contact form step 3): Online Booking · Gallery · Menu · Contact Form · SEO · Blog

Step 4 — Budget

Headline: "What's your rough budget?"
Same 4 budget tier cards as contact form step 2.

Final Step — Launch

Headline: "You're ready. Let's build."
Summary card showing their answers (business type, goal, features, budget) in a clean rounded-3xl bg-surface-container-low list
CTA: "Start your project →" bg-secondary text-on-primary rounded-full w-full py-4 font-semibold → navigates to /contact with all onboarding values pre-filled as query params


PAGE 8 — /onboarding/guided — Guided Onboarding with Live Preview
Goal: More immersive onboarding. User builds their brief while seeing a live preview sidebar update in real time.
Layout: 2-column split. Left 55% is the form steps. Right 45% is a sticky live preview panel.
Left — 5 Steps:
Step 1 — Business Details

Business name · Industry (pill selector) · Location (city/town text input)
Live preview updates: shows business name in a mock browser tab on the right

Step 2 — Template Selection

Headline: "Pick a starting point."
7 template thumbnails in a 2-column grid (real templates from the showcase):

Aries Grooming · AVT Restaurant · Aries Ventures Barber · AVT Restaurant 2 · AVT Restaurant 3 · AVT Restaurant 4 · AV Saloon


Selected template → ring-2 ring-secondary scale-[1.02]
Live preview updates: shows the selected template's demo in a mock mobile frame on the right

Step 3 — Pages Needed

Multi-select: Home · About · Gallery · Menu/Services · Booking · Contact · Blog
Selected pills → bg-secondary-fixed text-on-secondary-fixed rounded-full
Live preview: shows a simplified sitemap diagram of selected pages

Step 4 — Contact Preferences

Preferred contact method: Email · Phone · WhatsApp (pill selector)
Best time to reach: Morning · Afternoon · Evening (pill selector)
Phone / email input appears based on selection

Step 5 — Review & Submit

Full summary of all answers in a rounded-3xl bg-surface-container-low card
"Submit brief →" → POST /api/contact/submit/ → /contact/thank-you

Right — Live Preview Panel (sticky, bg-surface-container-low rounded-3xl):

Mock browser chrome at top (3 dots + URL bar showing aries-ventures.com)
Content updates per step:

Step 1: Business name in mock hero headline
Step 2: Template thumbnail fills the mock browser viewport
Step 3: Sitemap node diagram of selected pages
Step 4: Contact preference confirmation card
Step 5: Full brief summary




PAGE 9 — /help — Help & Support Form
Goal: Quick, low-friction support submission.
Layout: Centred single-column, max-width 600px, bg-surface.
Top: Short hero — "How can we help?" headline + "We typically reply within 4 hours." sub-line. No image, no blob. Pure typography.
Category selector (full-width pill row): Billing · Technical Issue · Website Change · New Feature · General Enquiry

Selected → bg-secondary text-on-primary rounded-full. Unselected → bg-surface-container border-outline-variant/15 rounded-full

Form card (rounded-3xl bg-surface-container-lowest):

Subject (text input)
Message (textarea, min 4 rows)
File attachment (ghost button: "Attach a file" border-outline-variant/20 rounded-full, shows filename pill on attach)
Submit CTA → bg-secondary text-on-primary rounded-full w-full py-4

Below form: 3 alternative support options as ghost pill links: "Email us directly" · "WhatsApp us" · "Browse FAQ →" (links to homepage #faq anchor)
API: POST /api/contact/submit/ with category field. Success → success toast via NotificationService, form resets.

Shared Rules Across All Pages
Navbar — present on all pages. Glassmorphism backdrop-blur-xl bg-surface/80. Auth-aware: guest → Login + "Get Started" CTA. Logged in → Avatar initials circle + "Dashboard" link + dropdown with Profile / Logout. Morphs to border-outline-variant/20 on scroll.
Footer — present on public pages (/contact, /contact/thank-you, /help). bg-primary-container rounded-t-3xl. 3-column grid. "System Operational" status dot (pulsing green) + font-mono text-xs label.
Toasts — all form submissions, auth events, and errors use NotificationService. Never inline alerts except password strength and field validation errors. Toast stack: top-right, auto-dismiss 4s, manual close button.
Loading states — every API call shows a global spinner overlay via the existing loading interceptor. CTA buttons go to opacity-50 pointer-events-none while loading. Never duplicate loading indicators.
Mobile — every page collapses its split layout to a single column at md: breakpoint. Sidebar on Dashboard becomes a bottom tab bar. Left panels on Auth pages become a condensed header strip.
Angular conventions — standalone components (standalone: true). @if / @for control flow. OnPush change detection. No *ngIf / *ngFor. No Angular animations module — CSS transitions only.

Execution Directive

Build every page as if it were designed in Google Stitch and hand-coded by a senior engineer who has lived inside Structured Fluidity for months. Every surface shift is intentional. Every button is rounded-full. Every dark section is bg-primary-container. No custom colours. No new fonts. No exceptions.