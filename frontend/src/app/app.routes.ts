import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./app.component').then(m => m.AppComponent)
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/pages/contact-form/contact-form.component').then(m => m.ContactFormComponent)
  },
  {
    path: 'contact/thank-you',
    loadComponent: () => import('./features/contact/pages/thank-you/thank-you.component').then(m => m.ThankYouComponent)
  },
  { path: '**', redirectTo: '' }
];
