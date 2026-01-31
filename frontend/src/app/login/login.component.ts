import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { NotificationService } from '../core/services/notification.service';
import { ErrorHandlerService } from '../core/services/error-handler.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private notificationService: NotificationService,
    private errorHandler: ErrorHandlerService
  ) {}

  onSubmit() {
    if (this.isLoading) return;
    
    // Basic validation
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials = {
      email: this.loginData.email,
      password: this.loginData.password
    };

    this.apiService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          this.notificationService.success('Welcome back!', 'You have been logged in successfully.');
          
          // Check for redirect URL, otherwise go to home
          const redirectUrl = localStorage.getItem('redirectUrl') || '/';
          localStorage.removeItem('redirectUrl');
          this.router.navigate([redirectUrl]);
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = this.errorHandler.getErrorMessage(error);
        this.errorHandler.logError(error, 'Login');
        
        this.notificationService.error('Login Failed', this.errorMessage);
      }
    });
  }

  onForgotPassword() {
    if (!this.loginData.email) {
      this.errorMessage = 'Please enter your email address first';
      return;
    }

    this.apiService.requestPasswordReset(this.loginData.email).subscribe({
      next: (response) => {
        if (response.success) {
          this.notificationService.success('Reset Email Sent', 'Password reset instructions have been sent to your email.');
        } else {
          this.errorMessage = response.message || 'Failed to send reset email';
          this.notificationService.error('Reset Failed', this.errorMessage);
        }
      },
      error: (error) => {
        this.errorMessage = this.errorHandler.getErrorMessage(error);
        this.errorHandler.logError(error, 'Password Reset');
        this.notificationService.error('Reset Failed', this.errorMessage);
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
