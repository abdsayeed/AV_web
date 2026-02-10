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
    // Trim whitespace
    this.registerData.fullName = this.registerData.fullName.trim();
    this.registerData.email = this.registerData.email.trim();
    this.registerData.businessName = this.registerData.businessName.trim();

    if (!this.registerData.fullName) {
      this.errorMessage = 'Full name is required';
      return false;
    }

    // Validate name length
    if (this.registerData.fullName.length < 2) {
      this.errorMessage = 'Full name must be at least 2 characters';
      return false;
    }

    if (!this.registerData.email) {
      this.errorMessage = 'Email is required';
      return false;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.errorMessage = 'Please enter a valid email address';
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

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(this.registerData.password);
    const hasLowerCase = /[a-z]/.test(this.registerData.password);
    const hasNumber = /[0-9]/.test(this.registerData.password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      this.errorMessage = 'Password must contain uppercase, lowercase, and numbers';
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

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  nextStep() {
    // Validate step 1 before proceeding
    if (this.currentStep === 1) {
      // Trim whitespace
      this.registerData.fullName = this.registerData.fullName.trim();
      this.registerData.email = this.registerData.email.trim();
      
      if (!this.registerData.fullName || !this.registerData.email) {
        this.errorMessage = 'Please fill in all required fields';
        return;
      }

      // Validate name length
      if (this.registerData.fullName.length < 2) {
        this.errorMessage = 'Full name must be at least 2 characters';
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.registerData.email)) {
        this.errorMessage = 'Please enter a valid email address';
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