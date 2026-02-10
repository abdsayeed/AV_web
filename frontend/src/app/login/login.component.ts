import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';

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
    private authService: AuthService
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

    // Use AuthService for unified authentication
    this.authService.loginWithCustom(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          console.log('Login successful');
          
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
        this.errorMessage = error.message || 'Login failed. Please try again.';
        console.error('Login error:', error);
      }
    });
  }

  onForgotPassword() {
    if (!this.loginData.email) {
      this.errorMessage = 'Please enter your email address first';
      return;
    }

    this.authService.resetPassword(this.loginData.email).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Reset email sent successfully');
        } else {
          this.errorMessage = response.message || 'Failed to send reset email';
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to send reset email';
        console.error('Password reset error:', error);
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Social Login Methods
  loginWithGoogle() {
    this.authService.loginWithGoogle().subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Google login successful');
          this.router.navigate(['/']);
        } else {
          this.errorMessage = response.message || 'Google login failed';
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Google login failed';
        console.error('Google login error:', error);
      }
    });
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook().subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Facebook login successful');
          this.router.navigate(['/']);
        } else {
          this.errorMessage = response.message || 'Facebook login failed';
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Facebook login failed';
        console.error('Facebook login error:', error);
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
