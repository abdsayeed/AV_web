import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard, GuestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./app.component').then(m => m.AppComponent)
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
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];
