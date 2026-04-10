import { Routes } from '@angular/router';
import { AuthGuard, GuestGuard, AdminGuard } from './core/guards/auth.guard';

// Routes for the upgraded platform — components live in frontend/src/app/
// The apps/web directory provides the new config, guards, and services
// while the existing frontend/ Angular app remains the source of components.
export const routes: Routes = [
  { path: 'login', canActivate: [GuestGuard], loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', canActivate: [GuestGuard], loadComponent: () => import('./features/register/register.component').then(m => m.RegisterComponent) },
  { path: 'dashboard', canActivate: [AuthGuard], loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'admin', canActivate: [AuthGuard, AdminGuard], loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent) },
  { path: '**', redirectTo: '' },
];
