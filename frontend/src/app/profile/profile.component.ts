import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { NavComponent } from '../shared/components/nav/nav.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavComponent],
  template: `
    <div class="min-h-screen bg-surface font-body overflow-hidden">
      <!-- Navbar (Auth Aware from shared component) -->
      <app-nav [navItems]="[]" [activeSection]="''" (linkClick)="goToHome()"></app-nav>

      <main class="max-w-[680px] mx-auto px-6 py-32 cinematic-reveal">
        
        <!-- Top Card: Profile Head -->
        <div class="bg-surface-container-lowest rounded-3xl p-10 flex flex-col items-center shadow-sm border border-outline-variant/10 text-center mb-8 relative">
          <!-- Avatar Initial -->
          <div class="w-20 h-20 bg-secondary-fixed text-on-secondary-fixed text-3xl font-bold font-headline rounded-full flex items-center justify-center shadow-lg shadow-secondary-fixed/30 mb-4">
            {{ (profileData.name || 'U').charAt(0).toUpperCase() }}
          </div>
          <h1 class="text-3xl font-headline font-bold text-on-surface mb-2">
            {{ profileData.name || 'Your Profile' }}
          </h1>
          <p class="text-on-surface-variant font-medium mb-3">{{ profileData.email }}</p>
          <span class="bg-surface-container-high text-on-surface-variant rounded-full text-xs font-mono px-4 py-1.5 font-bold tracking-widest uppercase">
            Client
          </span>
        </div>

        <!-- Edit Form Card -->
        <div class="bg-surface-container-lowest rounded-3xl p-8 lg:p-10 shadow-sm border border-outline-variant/10 mb-8 cinematic-reveal" style="transition-delay: 100ms">
          <h2 class="text-xl font-headline font-bold text-on-surface mb-6">Profile Information</h2>
          <form (ngSubmit)="updateProfile()" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-on-surface mb-2 pointer-events-none">Full Name</label>
              <input type="text" [(ngModel)]="profileData.name" name="name" required
                     class="w-full px-5 py-4 bg-surface-container border border-outline-variant/15 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary transition-all">
            </div>

            <div>
              <label class="block text-sm font-semibold text-on-surface mb-2 pointer-events-none">Email Address</label>
              <input type="email" [(ngModel)]="profileData.email" name="email" required
                     class="w-full px-5 py-4 bg-surface-container border border-outline-variant/15 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary transition-all">
            </div>

            <div>
              <label class="block text-sm font-semibold text-on-surface mb-2 pointer-events-none">Business Name</label>
              <input type="text" [(ngModel)]="profileData.businessName" name="businessName"
                     class="w-full px-5 py-4 bg-surface-container border border-outline-variant/15 rounded-xl text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                     placeholder="e.g. Aries Grooming">
            </div>

            <div>
              <label class="block text-sm font-semibold text-on-surface mb-2 pointer-events-none">Phone Number</label>
              <input type="tel" [(ngModel)]="profileData.phone" name="phone"
                     class="w-full px-5 py-4 bg-surface-container border border-outline-variant/15 rounded-xl text-on-surface placeholder-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
                     placeholder="+44 7000 000000">
            </div>

            <button type="submit" [disabled]="isLoading"
                    class="w-full bg-secondary text-on-primary py-4 mt-2 rounded-full font-bold hover:bg-secondary-container transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2">
              @if (!isLoading) { Save Changes }
              @else { 
                <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> 
              }
            </button>
          </form>
        </div>

        <!-- Change Password Card -->
        <div class="bg-surface-container-lowest rounded-3xl p-8 lg:p-10 shadow-sm border border-outline-variant/10 mb-8 cinematic-reveal" style="transition-delay: 200ms">
          <h2 class="text-xl font-headline font-bold text-on-surface mb-6">Change Password</h2>
          <form (ngSubmit)="changePassword()" class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-on-surface mb-2 pointer-events-none">Current Password</label>
              <div class="relative">
                <input [type]="showCurrentPassword ? 'text' : 'password'" [(ngModel)]="passwordData.currentPassword" name="currentPassword" required
                       class="w-full px-5 py-4 pr-12 bg-surface-container border border-outline-variant/15 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary transition-all">
                <button type="button" (click)="toggleCurrentPassword()"
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                  <span class="material-symbols-outlined">{{ showCurrentPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-on-surface mb-2 pointer-events-none">New Password</label>
              <div class="relative">
                <input [type]="showNewPassword ? 'text' : 'password'" [(ngModel)]="passwordData.newPassword" name="newPassword" (input)="checkPasswordStrength()" required
                       class="w-full px-5 py-4 pr-12 bg-surface-container border border-outline-variant/15 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary transition-all">
                <button type="button" (click)="toggleNewPassword()"
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                  <span class="material-symbols-outlined">{{ showNewPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
              
              <!-- Password Strength Bar -->
              <div class="mt-3 flex gap-1 h-1.5 w-full rounded-full overflow-hidden bg-surface-container">
                <div class="h-full transition-all duration-300" [ngClass]="strengthColors[0]"></div>
                <div class="h-full transition-all duration-300" [ngClass]="strengthColors[1]"></div>
                <div class="h-full transition-all duration-300" [ngClass]="strengthColors[2]"></div>
                <div class="h-full transition-all duration-300" [ngClass]="strengthColors[3]"></div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-on-surface mb-2 pointer-events-none">Confirm New Password</label>
              <div class="relative">
                <input [type]="showConfirmPassword ? 'text' : 'password'" [(ngModel)]="passwordData.confirmPassword" name="confirmPassword" required
                       class="w-full px-5 py-4 pr-12 bg-surface-container border border-outline-variant/15 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary transition-all">
                <button type="button" (click)="toggleConfirmPassword()"
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                  <span class="material-symbols-outlined">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
                </button>
              </div>
            </div>

            <button type="submit" [disabled]="isPasswordLoading || !isPasswordValid()"
                    class="w-full bg-secondary text-on-primary py-4 mt-2 rounded-full font-bold hover:bg-secondary-container transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2">
              @if (!isPasswordLoading) { Update Password }
              @else { 
                <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> 
              }
            </button>
          </form>
        </div>

        <!-- Danger Zone -->
        <div class="bg-surface-container-lowest rounded-3xl p-8 lg:p-10 shadow-sm border border-error/20 cinematic-reveal" style="transition-delay: 300ms">
          <h2 class="text-xl font-headline font-bold text-error mb-2">Danger Zone</h2>
          <p class="text-on-surface-variant text-sm mb-6">This will log you out from all active sessions and devices.</p>
          <button (click)="logoutAll()" class="w-full py-4 border border-error/30 text-error rounded-full font-bold hover:bg-error/5 hover:border-error transition-colors active:scale-95">
            Log Out from All Devices
          </button>
        </div>

      </main>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

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
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  passwordReqs = { length: false, uppercase: false, lowercase: false, number: false };
  strengthColors = ['w-0', 'w-0', 'w-0', 'w-0'];

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

    setTimeout(() => {
      const elements = document.querySelectorAll('.cinematic-reveal');
      elements.forEach(el => {
        el.classList.add('opacity-100', 'translate-y-0');
        el.classList.remove('opacity-0', 'translate-y-6');
      });
    }, 100);
  }

  updateProfile() {
    if (!this.profileData.name || !this.profileData.email) {
      this.notificationService.error('Name and email are required');
      return;
    }
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.notificationService.success('Profile updated successfully!');
    }, 1000);
  }

  checkPasswordStrength() {
    const pw = this.passwordData.newPassword;
    this.passwordReqs.length = pw.length >= 8;
    this.passwordReqs.uppercase = /[A-Z]/.test(pw);
    this.passwordReqs.lowercase = /[a-z]/.test(pw);
    this.passwordReqs.number = /[0-9]/.test(pw);

    const score = Object.values(this.passwordReqs).filter(Boolean).length;
    this.strengthColors = ['w-0', 'w-0', 'w-0', 'w-0'];
    
    if (score > 0) {
      const baseClass = score <= 2 ? 'w-1/4 bg-error' : (score === 3 ? 'w-1/4 bg-yellow-500' : 'w-1/4 bg-secondary');
      for (let i = 0; i < score; i++) {
        this.strengthColors[i] = baseClass;
      }
    }
  }

  isPasswordValid(): boolean {
    return this.passwordReqs.length && this.passwordReqs.uppercase && this.passwordReqs.lowercase && this.passwordReqs.number;
  }

  changePassword() {
    if (!this.passwordData.currentPassword || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
      this.notificationService.error('All password fields are required');
      return;
    }
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.notificationService.error('New passwords do not match');
      return;
    }
    if (!this.isPasswordValid()) {
      this.notificationService.error('New password is not strong enough');
      return;
    }
    this.isPasswordLoading = true;
    setTimeout(() => {
      this.isPasswordLoading = false;
      this.notificationService.success('Password changed successfully!');
      this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
      this.strengthColors = ['w-0', 'w-0', 'w-0', 'w-0'];
    }, 1000);
  }

  logoutAll() {
    this.authService.logout();
  }

  toggleCurrentPassword() { this.showCurrentPassword = !this.showCurrentPassword; }
  toggleNewPassword() { this.showNewPassword = !this.showNewPassword; }
  toggleConfirmPassword() { this.showConfirmPassword = !this.showConfirmPassword; }

  goToHome() { this.router.navigate(['/']); }
}
