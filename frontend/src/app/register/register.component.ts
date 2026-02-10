import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    agreeToTerms: false
  };

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  currentStep = 1;
  errorMessage = '';

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  onSubmit() {
    if (this.isLoading) return;

    // Validation
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const userData = {
      name: this.registerData.fullName,
      email: this.registerData.email,
      password: this.registerData.password,
      confirm_password: this.registerData.confirmPassword,
      business_name: this.registerData.businessName,
      marketing_emails: false // Default to false
    };

    // Use AuthService for unified authentication
    this.authService.registerWithCustom(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response.success) {
          console.log('Registration successful');
          
          // Redirect to home page instead of dashboard
          this.router.navigate(['/']);
        } else {
          this.errorMessage = response.message || 'Registration failed';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }

  private validateForm(): boolean {
    if (!this.registerData.fullName.trim()) {
      this.errorMessage = 'Full name is required';
      return false;
    }

    if (!this.registerData.email.trim()) {
      this.errorMessage = 'Email is required';
      return false;
    }

    if (!this.registerData.password) {
      this.errorMessage = 'Password is required';
      return false;
    }

    if (this.registerData.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters long';
      return false;
    }

    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    if (!this.registerData.agreeToTerms) {
      this.errorMessage = 'Please agree to the terms and conditions';
      return false;
    }

    return true;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Social Login Methods
  loginWithGoogle() {
    this.authService.loginWithGoogle().subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Google registration successful');
          this.router.navigate(['/']);
        } else {
          this.errorMessage = response.message || 'Google registration failed';
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Google registration failed';
        console.error('Google registration error:', error);
      }
    });
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook().subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Facebook registration successful');
          this.router.navigate(['/']);
        } else {
          this.errorMessage = response.message || 'Facebook registration failed';
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Facebook registration failed';
        console.error('Facebook registration error:', error);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  nextStep() {
    // Validate step 1 before proceeding
    if (this.currentStep === 1) {
      if (!this.registerData.fullName.trim() || !this.registerData.email.trim()) {
        this.errorMessage = 'Please fill in all required fields';
        return;
      }
      this.errorMessage = '';
    }

    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.errorMessage = '';
    }
  }
}
