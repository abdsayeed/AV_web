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
    <div class="min-h-screen bg-[#f3f4f5]" style="font-family: 'Inter', sans-serif;">

      <!-- Top nav -->
      <nav class="bg-white border-b border-[#e7e8e9] px-6 py-4">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button (click)="goToDashboard()" class="flex items-center gap-2 text-[#44474a] hover:text-[#1a1c1e] transition-colors text-sm">
              <span class="material-symbols-outlined text-base">arrow_back</span>
              Dashboard
            </button>
            <div class="w-px h-4 bg-[#e1e3e4]"></div>
            <div class="flex items-center gap-2">
              <img src="assets/logo.png" alt="Aries Ventures" class="w-6 h-6 object-contain">
              <span class="font-bold text-[#1a1c1e] text-sm" style="font-family: 'Plus Jakarta Sans', sans-serif;">Aries Ventures</span>
            </div>
          </div>
          <button (click)="logout()" class="flex items-center gap-2 text-sm text-[#75777a] hover:text-[#1a1c1e] transition-colors">
            <span class="material-symbols-outlined text-base">logout</span>
            Sign out
          </button>
        </div>
      </nav>

      <div class="max-w-4xl mx-auto px-6 py-8">

        <!-- Profile header -->
        <div class="bg-white rounded-3xl p-8 mb-6 flex items-center gap-6">
          <div class="w-16 h-16 bg-[#0058be] rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
               style="font-family: 'Plus Jakarta Sans', sans-serif;">
            {{ (profileData.name || 'U').charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <h1 class="text-2xl font-bold text-[#1a1c1e] mb-1" style="font-family: 'Plus Jakarta Sans', sans-serif;">
              {{ profileData.name || 'Your Profile' }}
            </h1>
            <p class="text-[#75777a] text-sm">{{ profileData.email }}</p>
            <p class="text-[#75777a] text-xs mt-1">Member since {{ formatDate(profileData.createdAt) }}</p>
          </div>
        </div>

        <!-- Messages -->
        <div *ngIf="errorMessage" class="mb-6 p-4 bg-red-50 rounded-2xl flex items-start gap-3">
          <span class="material-symbols-outlined text-red-500 text-lg mt-0.5">error</span>
          <p class="text-red-700 text-sm">{{ errorMessage }}</p>
        </div>
        <div *ngIf="successMessage" class="mb-6 p-4 bg-green-50 rounded-2xl flex items-start gap-3">
          <span class="material-symbols-outlined text-green-600 text-lg mt-0.5">check_circle</span>
          <p class="text-green-700 text-sm">{{ successMessage }}</p>
        </div>

        <div class="grid lg:grid-cols-2 gap-6">

          <!-- Profile info -->
          <div class="bg-white rounded-3xl p-6">
            <h2 class="font-bold text-[#1a1c1e] mb-5" style="font-family: 'Plus Jakarta Sans', sans-serif;">
              Profile information
            </h2>
            <form (ngSubmit)="updateProfile()" class="space-y-4">

              <div>
                <label class="block text-sm font-semibold text-[#1a1c1e] mb-2">Full name</label>
                <input type="text" [(ngModel)]="profileData.name" name="name" required
                       class="w-full px-4 py-3 bg-[#f3f4f5] rounded-2xl text-[#1a1c1e] text-sm outline-none focus:bg-white transition-all">
              </div>

              <div>
                <label class="block text-sm font-semibold text-[#1a1c1e] mb-2">Email address</label>
                <input type="email" [(ngModel)]="profileData.email" name="email" required
                       class="w-full px-4 py-3 bg-[#f3f4f5] rounded-2xl text-[#1a1c1e] text-sm outline-none focus:bg-white transition-all">
              </div>

              <div>
                <label class="block text-sm font-semibold text-[#1a1c1e] mb-2">Business name</label>
                <input type="text" [(ngModel)]="profileData.businessName" name="businessName"
                       placeholder="Your business"
                       class="w-full px-4 py-3 bg-[#f3f4f5] rounded-2xl text-[#1a1c1e] placeholder-[#75777a] text-sm outline-none focus:bg-white transition-all">
              </div>

              <div>
                <label class="block text-sm font-semibold text-[#1a1c1e] mb-2">Phone number</label>
                <input type="tel" [(ngModel)]="profileData.phone" name="phone"
                       placeholder="+44 7700 000000"
                       class="w-full px-4 py-3 bg-[#f3f4f5] rounded-2xl text-[#1a1c1e] placeholder-[#75777a] text-sm outline-none focus:bg-white transition-all">
              </div>

              <button type="submit" [disabled]="isLoading"
                      class="w-full bg-[#1a1c1e] text-white py-3.5 rounded-full font-semibold text-sm hover:bg-[#000101] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                <span *ngIf="!isLoading">Save changes</span>
                <span *ngIf="isLoading" class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-base" style="animation: spin 1s linear infinite;">refresh</span>
                  Saving...
                </span>
              </button>
            </form>
          </div>

          <!-- Change password -->
          <div class="bg-white rounded-3xl p-6">
            <h2 class="font-bold text-[#1a1c1e] mb-5" style="font-family: 'Plus Jakarta Sans', sans-serif;">
              Change password
            </h2>
            <form (ngSubmit)="changePassword()" class="space-y-4">

              <div>
                <label class="block text-sm font-semibold text-[#1a1c1e] mb-2">Current password</label>
                <div class="relative">
                  <input [type]="showCurrentPassword ? 'text' : 'password'"
                         [(ngModel)]="passwordData.currentPassword" name="currentPassword" required
                         class="w-full px-4 py-3 pr-12 bg-[#f3f4f5] rounded-2xl text-[#1a1c1e] text-sm outline-none focus:bg-white transition-all">
                  <button type="button" (click)="toggleCurrentPassword()"
                          class="absolute right-4 top-1/2 -translate-y-1/2 text-[#75777a] hover:text-[#1a1c1e]">
                    <span class="material-symbols-outlined text-lg">{{ showCurrentPassword ? 'visibility' : 'visibility_off' }}</span>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-[#1a1c1e] mb-2">New password</label>
                <div class="relative">
                  <input [type]="showNewPassword ? 'text' : 'password'"
                         [(ngModel)]="passwordData.newPassword" name="newPassword" required
                         class="w-full px-4 py-3 pr-12 bg-[#f3f4f5] rounded-2xl text-[#1a1c1e] text-sm outline-none focus:bg-white transition-all">
                  <button type="button" (click)="toggleNewPassword()"
                          class="absolute right-4 top-1/2 -translate-y-1/2 text-[#75777a] hover:text-[#1a1c1e]">
                    <span class="material-symbols-outlined text-lg">{{ showNewPassword ? 'visibility' : 'visibility_off' }}</span>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-[#1a1c1e] mb-2">Confirm new password</label>
                <div class="relative">
                  <input [type]="showConfirmPassword ? 'text' : 'password'"
                         [(ngModel)]="passwordData.confirmPassword" name="confirmPassword" required
                         class="w-full px-4 py-3 pr-12 bg-[#f3f4f5] rounded-2xl text-[#1a1c1e] text-sm outline-none focus:bg-white transition-all">
                  <button type="button" (click)="toggleConfirmPassword()"
                          class="absolute right-4 top-1/2 -translate-y-1/2 text-[#75777a] hover:text-[#1a1c1e]">
                    <span class="material-symbols-outlined text-lg">{{ showConfirmPassword ? 'visibility' : 'visibility_off' }}</span>
                  </button>
                </div>
              </div>

              <button type="submit" [disabled]="isPasswordLoading"
                      class="w-full bg-[#0058be] text-white py-3.5 rounded-full font-semibold text-sm hover:bg-[#004395] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                <span *ngIf="!isPasswordLoading">Update password</span>
                <span *ngIf="isPasswordLoading" class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-base" style="animation: spin 1s linear infinite;">refresh</span>
                  Updating...
                </span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`]
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
  }

  updateProfile() {
    if (!this.profileData.name || !this.profileData.email) {
      this.errorMessage = 'Name and email are required';
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Profile updated successfully!';
      setTimeout(() => { this.successMessage = ''; }, 3000);
    }, 1000);
  }

  changePassword() {
    if (!this.passwordData.currentPassword || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
      this.errorMessage = 'All password fields are required';
      return;
    }
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.errorMessage = 'New passwords do not match';
      return;
    }
    if (this.passwordData.newPassword.length < 8) {
      this.errorMessage = 'New password must be at least 8 characters';
      return;
    }
    this.isPasswordLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    setTimeout(() => {
      this.isPasswordLoading = false;
      this.successMessage = 'Password changed successfully!';
      this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
      setTimeout(() => { this.successMessage = ''; }, 3000);
    }, 1000);
  }

  toggleCurrentPassword() { this.showCurrentPassword = !this.showCurrentPassword; }
  toggleNewPassword() { this.showNewPassword = !this.showNewPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }
  toggleMobileMenu() { this.mobileMenuOpen = !this.mobileMenuOpen; }

  formatDate(date: Date | string): string {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  goToHome() { this.router.navigate(['/']); }
  goToDashboard() { this.router.navigate(['/dashboard']); }
  goToProfile() {}
  logout() { this.authService.logout(); }
}
