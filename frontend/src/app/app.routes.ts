import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard, GuestGuard, AdminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app.component').then(m => m.AppComponent)
  },
  {
    path: 'templates',
    loadComponent: () => import('./features/templates/templates.component').then(m => m.TemplatesComponent)
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [GuestGuard]
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/pages/contact-form/contact-form.component').then(m => m.ContactFormComponent)
  },
  {
    path: 'contact/thank-you',
    loadComponent: () => import('./features/contact/pages/thank-you/thank-you.component').then(m => m.ThankYouComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'help',
    loadComponent: () => import('./features/help/help-form.component').then(m => m.HelpFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./onboarding/onboarding.component').then(m => m.OnboardingComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'onboarding/guided',
    loadComponent: () => import('./features/guided-onboarding/guided-onboarding.component').then(m => m.GuidedOnboardingComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AuthGuard, AdminGuard]
  },
  { path: '**', redirectTo: '' }
];
