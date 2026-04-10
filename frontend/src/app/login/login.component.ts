import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements AfterViewInit {
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
    private authService: AuthService
  ) {}

  onSubmit() {
    if (this.isLoading) return;
    
    // Trim whitespace
    this.loginData.email = this.loginData.email.trim();
    
    // Basic validation
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.loginData.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Use AuthService for unified authentication
    this.authService.loginWithCustom(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          console.log('Login successful');
          
          // Check for redirect URL, otherwise go to home
          const redirectUrl = localStorage.getItem('redirectUrl') || '/';
          localStorage.removeItem('redirectUrl');
          
          // Small delay to ensure auth state is updated
          setTimeout(() => {
            this.router.navigate([redirectUrl]);
          }, 100);
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        
        // Handle different error types
        if (error.message) {
          this.errorMessage = error.message;
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (!navigator.onLine) {
          this.errorMessage = 'No internet connection. Please check your network.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
        
        console.error('Login error:', error);
      }
    });
  }

  onForgotPassword() {
    // Trim whitespace
    const email = this.loginData.email.trim();
    
    if (!email) {
      this.errorMessage = 'Please enter your email address first';
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.resetPassword(email).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.errorMessage = '';
        alert('If that email exists, a reset link has been sent. Please check your inbox.');
      },
      error: (error) => {
        this.isLoading = false;
        if (error.message) {
          this.errorMessage = error.message;
        } else if (!navigator.onLine) {
          this.errorMessage = 'No internet connection. Please check your network.';
        } else {
          this.errorMessage = 'Failed to send reset email. Please try again.';
        }
        
        console.error('Password reset error:', error);
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const elements = document.querySelectorAll('.cinematic-reveal');
      elements.forEach(el => {
        el.classList.add('opacity-100', 'translate-y-0');
        el.classList.remove('opacity-0', 'translate-y-6');
      });
    }, 100);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}