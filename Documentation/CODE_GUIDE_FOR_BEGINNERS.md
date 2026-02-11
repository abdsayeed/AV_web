# Code Guide for Beginners

## Overview

This document explains the codebase structure and key concepts for developers new to Angular and web development.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Key Concepts](#key-concepts)
3. [Core Services Explained](#core-services-explained)
4. [Components Explained](#components-explained)
5. [How Data Flows](#how-data-flows)
6. [Common Patterns](#common-patterns)

---

## Project Structure

```
AV_web/
├── frontend/                    # Angular application (what users see)
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Core functionality (services, guards, interceptors)
│   │   │   │   ├── services/   # Reusable business logic
│   │   │   │   ├── interceptors/ # HTTP request/response handlers
│   │   │   │   └── models/     # TypeScript interfaces (data structures)
│   │   │   ├── features/       # Feature modules (contact form, help, etc.)
│   │   │   ├── shared/         # Shared components (used across features)
│   │   │   ├── login/          # Login page
│   │   │   ├── register/       # Registration page
│   │   │   ├── dashboard/      # User dashboard
│   │   │   └── profile/        # User profile page
│   │   ├── assets/             # Images, fonts, static files
│   │   └── environments/       # Configuration (dev vs production)
│   └── package.json            # Frontend dependencies
│
├── backend/                     # Django application (server/API)
│   ├── apps/                   # Django apps (modular features)
│   │   ├── users/              # User authentication & management
│   │   ├── contact/            # Contact form submissions
│   │   ├── analytics/          # Usage analytics
│   │   ├── notifications/      # User notifications
│   │   ├── pricing/            # Pricing plans
│   │   └── templates/          # Website templates
│   ├── config/                 # Django settings
│   └── requirements/           # Python dependencies
│
└── Documentation/              # Project documentation
```

---

## Key Concepts

### 1. What is Angular?

Angular is a framework for building web applications. Think of it like a construction kit with pre-made parts:

- **Components**: Building blocks of the UI (like LEGO pieces)
- **Services**: Reusable business logic (like tools in a toolbox)
- **Modules**: Groups of related components and services
- **Routing**: Navigation between pages

### 2. What is a Service?

A service is a class that provides functionality to multiple components. It's like a shared utility:

```typescript
// Example: AuthService provides authentication to all components
@Injectable({ providedIn: 'root' })
export class AuthService {
  login(email, password) { /* ... */ }
  logout() { /* ... */ }
  isAuthenticated() { /* ... */ }
}
```

**Why use services?**
- Avoid code duplication
- Share data between components
- Separate business logic from UI logic

### 3. What is an Observable?

An Observable is like a stream of data over time. Think of it like a YouTube live stream:

- You can subscribe to watch it
- It sends data whenever something happens
- You can unsubscribe when you're done

```typescript
// Example: Watching for authentication changes
this.authService.authState$.subscribe(state => {
  if (state.isAuthenticated) {
    console.log('User logged in!');
  }
});
```

### 4. What is Dependency Injection?

Dependency Injection is Angular's way of providing services to components:

```typescript
// Old way (constructor injection)
constructor(private authService: AuthService) {}

// New way (inject function)
private authService = inject(AuthService);
```

Angular automatically creates and provides the service instance.

### 5. What is TypeScript?

TypeScript is JavaScript with types. It helps catch errors before running code:

```typescript
// JavaScript (no types)
function add(a, b) {
  return a + b;
}

// TypeScript (with types)
function add(a: number, b: number): number {
  return a + b;
}
```

---

## Core Services Explained

### 1. AuthService (`frontend/src/app/core/services/auth.service.ts`)

**Purpose**: Manages user authentication (login, register, logout)

**Key Methods**:
- `loginWithCustom(email, password)` - Log in a user
- `registerWithCustom(name, email, password)` - Create new account
- `logout()` - Log out current user
- `isAuthenticated()` - Check if user is logged in
- `getCurrentUser()` - Get current user data

**How it works**:
1. User enters credentials
2. Service sends to backend API
3. Backend validates and returns JWT token
4. Service saves token in localStorage
5. Service updates authentication state
6. All components are notified of the change

**Example Usage**:
```typescript
// In a component
login() {
  this.authService.loginWithCustom(this.email, this.password)
    .subscribe({
      next: (response) => {
        console.log('Login successful!');
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
}
```

### 2. ApiService (`frontend/src/app/core/services/api.service.ts`)

**Purpose**: Handles all HTTP requests to the backend

**Key Methods**:
- `login(email, password)` - POST to /auth/login/
- `register(...)` - POST to /auth/register/
- `getCurrentUser()` - GET to /auth/user/
- `submitContactForm(data)` - POST to /contact/submit/
- `updateProfile(data)` - PUT to /auth/profile/

**How it works**:
1. Component calls API method
2. Service makes HTTP request to backend
3. Backend processes and responds
4. Service returns response to component

**Example Usage**:
```typescript
// In a component
submitForm() {
  this.apiService.submitContactForm(this.formData)
    .subscribe({
      next: (response) => {
        console.log('Form submitted!', response);
      },
      error: (error) => {
        console.error('Submission failed:', error);
      }
    });
}
```

### 3. FormStateService (`frontend/src/app/core/services/form-state.service.ts`)

**Purpose**: Manages multi-step contact form state

**Key Methods**:
- `updateFormData(step, data)` - Save form data for a step
- `nextStep()` - Move to next step
- `previousStep()` - Move to previous step
- `goToStep(stepNumber)` - Jump to specific step
- `resetForm()` - Clear all form data

**How it works**:
1. User fills out step 1
2. Service saves data to localStorage
3. User moves to step 2
4. If user refreshes page, data is restored
5. On final step, all data is submitted

### 4. NotificationService (`frontend/src/app/core/services/notification.service.ts`)

**Purpose**: Shows toast notifications to users

**Key Methods**:
- `success(title, message)` - Show success message
- `error(title, message)` - Show error message
- `warning(title, message)` - Show warning message
- `info(title, message)` - Show info message
- `remove(id)` - Remove specific notification
- `clear()` - Remove all notifications

**Example Usage**:
```typescript
// Show success message
this.notificationService.success(
  'Login Successful',
  'Welcome back!'
);

// Show error message
this.notificationService.error(
  'Login Failed',
  'Invalid email or password'
);
```

### 5. LoadingService (`frontend/src/app/core/services/loading.service.ts`)

**Purpose**: Shows/hides loading spinner

**Key Methods**:
- `show()` - Show loading spinner
- `hide()` - Hide loading spinner
- `forceHide()` - Immediately hide spinner

**How it works**:
- Tracks number of active operations
- Shows spinner when count > 0
- Hides spinner when count = 0

---

## Components Explained

### 1. AppComponent (`frontend/src/app/app.component.ts`)

**Purpose**: Main application component (home page)

**Key Features**:
- Navigation bar
- Hero section
- Services showcase
- Pricing plans
- Templates gallery
- Team section
- Contact form

**State Management**:
- `currentUser` - Currently logged in user
- `isAuthenticated` - Is user logged in?
- `mobileMenuOpen` - Is mobile menu visible?
- `templates` - Available website templates
- `pricingPlans` - Pricing options

### 2. LoginComponent (`frontend/src/app/login/login.component.ts`)

**Purpose**: User login page

**Key Features**:
- Email/password form
- Form validation
- Error handling
- Redirect after login

**Form Validation**:
- Email must be valid format
- Password required
- Shows error messages

### 3. RegisterComponent (`frontend/src/app/register/register.component.ts`)

**Purpose**: User registration page

**Key Features**:
- Name, email, password form
- Password confirmation
- Form validation
- Error handling

**Form Validation**:
- Name required (2-50 characters)
- Email must be valid
- Password must be strong (8+ chars, uppercase, lowercase, number)
- Passwords must match

### 4. DashboardComponent (`frontend/src/app/dashboard/dashboard.component.ts`)

**Purpose**: User dashboard after login

**Key Features**:
- Overview of user's projects
- Quick actions
- Recent activity
- Navigation sidebar

**Sections**:
- Overview - Main dashboard view
- Projects - List of user's projects
- Messages - Communication with team

### 5. ProfileComponent (`frontend/src/app/profile/profile.component.ts`)

**Purpose**: User profile management

**Key Features**:
- View/edit profile information
- Change password
- Update email
- Delete account

---

## How Data Flows

### Authentication Flow

```
1. User enters credentials in LoginComponent
   ↓
2. LoginComponent calls AuthService.loginWithCustom()
   ↓
3. AuthService calls ApiService.login()
   ↓
4. ApiService sends HTTP POST to backend
   ↓
5. Backend validates credentials
   ↓
6. Backend returns JWT token + user data
   ↓
7. ApiService returns response to AuthService
   ↓
8. AuthService saves token to localStorage
   ↓
9. AuthService updates authentication state
   ↓
10. All subscribed components are notified
   ↓
11. User is redirected to home page
```

### Contact Form Flow

```
1. User fills out Step 1 in ContactFormComponent
   ↓
2. Component calls FormStateService.updateFormData()
   ↓
3. FormStateService saves data to localStorage
   ↓
4. User clicks "Next"
   ↓
5. FormStateService.nextStep() is called
   ↓
6. Component shows Step 2
   ↓
7. Repeat for Steps 3 and 4
   ↓
8. On final step, all data is submitted
   ↓
9. ApiService.submitContactForm() sends to backend
   ↓
10. Backend processes and saves to database
   ↓
11. User sees success message
   ↓
12. FormStateService.resetForm() clears data
```

---

## Common Patterns

### 1. Subscribe to Observable

```typescript
// Subscribe to get data
this.authService.authState$.subscribe(state => {
  console.log('Auth state changed:', state);
});

// Don't forget to unsubscribe to prevent memory leaks!
// Use takeUntil or async pipe
```

### 2. Handle HTTP Errors

```typescript
this.apiService.login(email, password).subscribe({
  next: (response) => {
    // Success
    console.log('Login successful');
  },
  error: (error) => {
    // Error
    console.error('Login failed:', error);
    this.showErrorMessage(error.message);
  }
});
```

### 3. Form Validation

```typescript
// In component
validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// In template
<input [(ngModel)]="email" (blur)="validateEmail(email)">
<div *ngIf="!validateEmail(email)">Invalid email</div>
```

### 4. Conditional Rendering

```typescript
// Show/hide based on authentication
<div *ngIf="isAuthenticated">
  Welcome, {{ currentUser.name }}!
</div>

<div *ngIf="!isAuthenticated">
  <button (click)="goToLogin()">Login</button>
</div>
```

### 5. Navigation

```typescript
// In component
constructor(private router: Router) {}

goToLogin() {
  this.router.navigate(['/login']);
}

goToDashboard() {
  this.router.navigate(['/dashboard']);
}
```

---

## Testing

### Running Tests

```bash
# Run all tests
cd frontend
npm test

# Run specific test file
npm test -- --include='**/auth.service.spec.ts'
```

### Test Structure

```typescript
describe('AuthService', () => {
  // Setup before each test
  beforeEach(() => {
    // Create service instance
  });

  // Individual test
  it('should login user', () => {
    // Arrange: Set up test data
    const email = 'test@example.com';
    const password = 'password123';

    // Act: Perform action
    service.login(email, password);

    // Assert: Check result
    expect(service.isAuthenticated()).toBe(true);
  });
});
```

---

## Common Issues & Solutions

### 1. "Cannot find module" Error

**Problem**: Import path is wrong

**Solution**: Check the relative path
```typescript
// Wrong
import { AuthService } from 'auth.service';

// Correct
import { AuthService } from './core/services/auth.service';
```

### 2. "Property does not exist" Error

**Problem**: TypeScript doesn't know about the property

**Solution**: Define it in the interface or class
```typescript
export interface User {
  id: string;
  email: string;
  name: string;  // Add missing property
}
```

### 3. "Observable not subscribed" Error

**Problem**: Forgot to subscribe to Observable

**Solution**: Add .subscribe()
```typescript
// Wrong
this.apiService.login(email, password);

// Correct
this.apiService.login(email, password).subscribe();
```

### 4. "Memory leak" Warning

**Problem**: Didn't unsubscribe from Observable

**Solution**: Use async pipe or unsubscribe
```typescript
// In template (automatic unsubscribe)
<div *ngIf="authState$ | async as state">
  {{ state.user.name }}
</div>

// Or manually unsubscribe
ngOnDestroy() {
  this.subscription.unsubscribe();
}
```

---

## Next Steps

1. **Read the code**: Start with `auth.service.ts` (heavily commented)
2. **Run the app**: `npm start` in frontend folder
3. **Make small changes**: Try changing text or colors
4. **Add console.logs**: See what data looks like
5. **Read Angular docs**: https://angular.io/docs

---

## Helpful Resources

- **Angular Documentation**: https://angular.io/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **RxJS Documentation**: https://rxjs.dev/guide/overview
- **Django Documentation**: https://docs.djangoproject.com/

---

## Questions?

If you're stuck:
1. Check the console for error messages
2. Read the error message carefully
3. Google the error message
4. Check Stack Overflow
5. Ask a senior developer

Remember: Every developer was a beginner once. Don't be afraid to ask questions!
