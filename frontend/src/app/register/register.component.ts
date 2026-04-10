import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements AfterViewInit {
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

  passwordReqs = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  };
  strengthColors = ['w-0', 'w-0', 'w-0', 'w-0'];

  constructor(
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngAfterViewInit() {
    this.initCinematicReveal();
  }

  private initCinematicReveal() {
    setTimeout(() => {
      const elements = document.querySelectorAll('.cinematic-reveal');
      elements.forEach(el => {
        el.classList.add('opacity-100', 'translate-y-0');
        el.classList.remove('opacity-0', 'translate-y-6');
      });
    }, 100);
  }

  checkPasswordStrength() {
    const pw = this.registerData.password;
    this.passwordReqs.length = pw.length >= 8;
    this.passwordReqs.uppercase = /[A-Z]/.test(pw);
    this.passwordReqs.lowercase = /[a-z]/.test(pw);
    this.passwordReqs.number = /[0-9]/.test(pw);

    const score = Object.values(this.passwordReqs).filter(Boolean).length;
    
    // reset colors
    this.strengthColors = ['w-0', 'w-0', 'w-0', 'w-0'];
    
    if (score > 0) {
      const baseClass = score <= 2 ? 'w-1/4 bg-error' : (score === 3 ? 'w-1/4 bg-yellow-500' : 'w-1/4 bg-secondary');
      for (let i = 0; i < score; i++) {
        this.strengthColors[i] = baseClass;
      }
    }
  }

  isPasswordValid(): boolean {
    return this.passwordReqs.length && 
           this.passwordReqs.uppercase && 
           this.passwordReqs.lowercase && 
           this.passwordReqs.number;
  }

  onSubmit() {
    if (this.isLoading) return;

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
          this.router.navigate(['/onboarding']);
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
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
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