import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      
      <!-- Navigation -->
      <nav class="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-16">
            
            <!-- Logo -->
            <div class="flex items-center gap-3 cursor-pointer" (click)="goToHome()">
              <img src="assets/logo.png" alt="Aries Ventures" class="w-10 h-10 object-contain">
              <span class="text-xl font-bold text-white">Aries Ventures</span>
            </div>

            <!-- Navigation Links -->
            <div class="hidden md:flex items-center gap-6">
              <button (click)="goToHome()" 
                      class="text-blue-300 hover:text-white transition-colors flex items-center gap-2">
                <span class="material-symbols-outlined text-lg">home</span>
                Home
              </button>
              <button (click)="goToDashboard()" 
                      class="text-blue-300 hover:text-white transition-colors flex items-center gap-2">
                <span class="material-symbols-outlined text-lg">dashboard</span>
                Dashboard
              </button>
              <button (click)="goToProfile()" 
                      class="text-white px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 flex items-center gap-2">
                <span class="material-symbols-outlined text-lg">person</span>
                Profile
              </button>
            </div>

            <!-- Mobile Menu Button -->
            <button (click)="toggleMobileMenu()" 
                    class="md:hidden p-2 rounded-lg text-blue-200 hover:bg-blue-800 hover:text-white transition-all duration-300">
              <span *ngIf="!mobileMenuOpen" class="material-symbols-outlined text-xl">menu</span>
              <span *ngIf="mobileMenuOpen" class="material-symbols-outlined text-xl">close</span>
            </button>

            <!-- User Menu -->
            <div class="hidden md:flex items-center gap-4">
              <span class="hidden sm:block text-blue-200 text-sm">{{ profileData.name || 'User' }}</span>
              <button (click)="logout()" 
                      class="text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800 transition-all duration-300 hover:scale-105 focus-ring flex items-center gap-2">
                <span class="material-symbols-outlined text-lg">logout</span>
                Logout
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div *ngIf="mobileMenuOpen" 
             class="md:hidden border-t border-blue-800/50 bg-slate-900/95 backdrop-blur-md animate-slide-in">
          <div class="px-4 py-3 space-y-1">
            <button (click)="goToHome(); toggleMobileMenu()"
                    class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-blue-200 hover:bg-blue-800 hover:text-white transition-all duration-300 flex items-center gap-3">
              <span class="material-symbols-outlined text-lg">home</span>
              Home
            </button>
            <button (click)="goToDashboard(); toggleMobileMenu()"
                    class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-blue-200 hover:bg-blue-800 hover:text-white transition-all duration-300 flex items-center gap-3">
              <span class="material-symbols-outlined text-lg">dashboard</span>
              Dashboard
            </button>
            <button (click)="goToProfile(); toggleMobileMenu()"
                    class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium bg-blue-600 text-white flex items-center gap-3">
              <span class="material-symbols-outlined text-lg">person</span>
              Profile
            </button>
            <div class="border-t border-blue-800/50 pt-3 mt-3">
              <div class="px-4 py-2 text-blue-200 text-sm">
                {{ profileData.name || 'User' }}
              </div>
              <button (click)="logout(); toggleMobileMenu()"
                      class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-blue-200 hover:bg-blue-800 hover:text-white transition-all duration-300 flex items-center gap-3">
                <span class="material-symbols-outlined text-lg">logout</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Profile Header -->
        <div class="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 mb-8">
          <div class="flex items-center gap-6">
            <div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <span class="material-symbols-outlined text-3xl text-white">person</span>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white mb-2">
                {{ profileData.name || 'User Profile' }}
              </h1>
              <p class="text-blue-200">{{ profileData.email }}</p>
              <p class="text-blue-300 text-sm">
                Member since {{ formatDate(profileData.createdAt) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Error/Success Messages -->
        <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 animate-fade-in">
          {{ errorMessage }}
        </div>

        <div *ngIf="successMessage" class="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-200 animate-fade-in">
          {{ successMessage }}
        </div>

        <!-- Profile Form -->
        <div class="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
          <h2 class="text-2xl font-bold text-white mb-6">Profile Information</h2>
          
          <form (ngSubmit)="updateProfile()" class="space-y-6">
            
            <!-- Full Name -->
            <div class="space-y-2">
              <label class="block text-sm font-bold text-white">Full Name</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-blue-300 text-xl">person</span>
                </div>
                <input type="text" 
                       [(ngModel)]="profileData.name"
                       name="name"
                       required
                       class="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:bg-white/20 transition-all outline-none">
              </div>
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <label class="block text-sm font-bold text-white">Email Address</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-blue-300 text-xl">mail</span>
                </div>
                <input type="email" 
                       [(ngModel)]="profileData.email"
                       name="email"
                       required
                       class="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:bg-white/20 transition-all outline-none">
              </div>
            </div>

            <!-- Business Name -->
            <div class="space-y-2">
              <label class="block text-sm font-bold text-white">Business Name</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-blue-300 text-xl">business</span>
                </div>
                <input type="text" 
                       [(ngModel)]="profileData.businessName"
                       name="businessName"
                       class="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:bg-white/20 transition-all outline-none">
              </div>
            </div>

            <!-- Phone -->
            <div class="space-y-2">
              <label class="block text-sm font-bold text-white">Phone Number</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-blue-300 text-xl">phone</span>
                </div>
                <input type="tel" 
                       [(ngModel)]="profileData.phone"
                       name="phone"
                       class="w-full pl-12 pr-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:bg-white/20 transition-all outline-none">
              </div>
            </div>

            <!-- Update Button -->
            <button type="submit"
                    [disabled]="isLoading"
                    class="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/50 hover:shadow-blue-600/70 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <span *ngIf="!isLoading" class="flex items-center gap-2">
                <span class="material-symbols-outlined text-xl">save</span>
                Update Profile
              </span>
              <span *ngIf="isLoading" class="flex items-center gap-2">
                <span class="material-symbols-outlined animate-spin text-xl">refresh</span>
                Updating...
              </span>
            </button>

          </form>
        </div>

        <!-- Change Password Section -->
        <div class="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 mt-8">
          <h2 class="text-2xl font-bold text-white mb-6">Change Password</h2>
          
          <form (ngSubmit)="changePassword()" class="space-y-6">
            
            <!-- Current Password -->
            <div class="space-y-2">
              <label class="block text-sm font-bold text-white">Current Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-blue-300 text-xl">lock</span>
                </div>
                <input [type]="showCurrentPassword ? 'text' : 'password'"
                       [(ngModel)]="passwordData.currentPassword"
                       name="currentPassword"
                       required
                       class="w-full pl-12 pr-12 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:bg-white/20 transition-all outline-none">
                <button type="button"
                        (click)="toggleCurrentPassword()"
                        class="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-300 hover:text-white transition-colors">
                  <span class="material-symbols-outlined text-xl">{{ showCurrentPassword ? 'visibility' : 'visibility_off' }}</span>
                </button>
              </div>
            </div>

            <!-- New Password -->
            <div class="space-y-2">
              <label class="block text-sm font-bold text-white">New Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-blue-300 text-xl">key</span>
                </div>
                <input [type]="showNewPassword ? 'text' : 'password'"
                       [(ngModel)]="passwordData.newPassword"
                       name="newPassword"
                       required
                       class="w-full pl-12 pr-12 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:bg-white/20 transition-all outline-none">
                <button type="button"
                        (click)="toggleNewPassword()"
                        class="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-300 hover:text-white transition-colors">
                  <span class="material-symbols-outlined text-xl">{{ showNewPassword ? 'visibility' : 'visibility_off' }}</span>
                </button>
              </div>
            </div>

            <!-- Confirm New Password -->
            <div class="space-y-2">
              <label class="block text-sm font-bold text-white">Confirm New Password</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span class="material-symbols-outlined text-blue-300 text-xl">key</span>
                </div>
                <input [type]="showConfirmPassword ? 'text' : 'password'"
                       [(ngModel)]="passwordData.confirmPassword"
                       name="confirmPassword"
                       required
                       class="w-full pl-12 pr-12 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:border-blue-400 focus:bg-white/20 transition-all outline-none">
                <button type="button"
                        (click)="toggleConfirmPassword()"
                        class="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-300 hover:text-white transition-colors">
                  <span class="material-symbols-outlined text-xl">{{ showConfirmPassword ? 'visibility' : 'visibility_off' }}</span>
                </button>
              </div>
            </div>

            <!-- Change Password Button -->
            <button type="submit"
                    [disabled]="isPasswordLoading"
                    class="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-600/50 hover:shadow-green-600/70 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <span *ngIf="!isPasswordLoading" class="flex items-center gap-2">
                <span class="material-symbols-outlined text-xl">vpn_key</span>
                Change Password
              </span>
              <span *ngIf="isPasswordLoading" class="flex items-center gap-2">
                <span class="material-symbols-outlined animate-spin text-xl">refresh</span>
                Changing...
              </span>
            </button>

          </form>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.5s ease-in-out;
    }

    .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideIn {
      from { transform: translateX(-100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .focus-ring:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
  `]
})
export class ProfileComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);

  profileData = {
    name: '',
    email: '',
    businessName: '',
    phone: '',
    createdAt: new Date()
  };

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  isLoading = false;
  isPasswordLoading = false;
  errorMessage = '';
  successMessage = '';
  mobileMenuOpen = false;

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  ngOnInit() {
    this.loadProfile();
  }

  private loadProfile() {
    // Subscribe to current user
    this.apiService.currentUser$.subscribe(user => {
      if (user) {
        this.profileData = {
          name: user.name || '',
          email: user.email || '',
          businessName: user.business_name || '',
          phone: user.phone || '',
          createdAt: user.created_at ? new Date(user.created_at) : new Date()
        };
      }
    });

    // Load fresh user data from API when backend is ready
    if (this.apiService.isAuthenticated()) {
      // this.apiService.getCurrentUser().subscribe(...)
    }
  }

  updateProfile() {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Validate form
    if (!this.profileData.name || !this.profileData.email) {
      this.errorMessage = 'Name and email are required';
      this.isLoading = false;
      return;
    }

    // This will be implemented when backend is ready
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Profile updated successfully!';
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }, 1000);

    // Real implementation:
    // this.apiService.updateProfile(this.profileData).subscribe({
    //   next: (response) => {
    //     this.isLoading = false;
    //     this.successMessage = 'Profile updated successfully!';
    //   },
    //   error: (error) => {
    //     this.isLoading = false;
    //     this.errorMessage = error.error?.message || 'Failed to update profile';
    //   }
    // });
  }

  changePassword() {
    this.isPasswordLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Validate passwords
    if (!this.passwordData.currentPassword || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
      this.errorMessage = 'All password fields are required';
      this.isPasswordLoading = false;
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.errorMessage = 'New passwords do not match';
      this.isPasswordLoading = false;
      return;
    }

    if (this.passwordData.newPassword.length < 8) {
      this.errorMessage = 'New password must be at least 8 characters long';
      this.isPasswordLoading = false;
      return;
    }

    // This will be implemented when backend is ready
    setTimeout(() => {
      this.isPasswordLoading = false;
      this.successMessage = 'Password changed successfully!';
      
      // Clear form
      this.passwordData = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }, 1000);

    // Real implementation:
    // this.apiService.changePassword(this.passwordData).subscribe({
    //   next: (response) => {
    //     this.isPasswordLoading = false;
    //     this.successMessage = 'Password changed successfully!';
    //     this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
    //   },
    //   error: (error) => {
    //     this.isPasswordLoading = false;
    //     this.errorMessage = error.error?.message || 'Failed to change password';
    //   }
    // });
  }

  toggleCurrentPassword() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  formatDate(date: Date | string): string {
    if (!date) return 'Unknown';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToProfile() {
    // Already on profile, do nothing or refresh
  }

  logout() {
    this.authService.logout();
  }
}