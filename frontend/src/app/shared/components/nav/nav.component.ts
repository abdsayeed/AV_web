import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="fixed top-0 w-full z-50 glass-nav border-b border-outline-variant/10 transition-all duration-500">
      <div class="flex justify-between items-center w-full max-w-7xl mx-auto px-8 py-4">

        <!-- Logo -->
        <div class="flex items-center gap-3 cursor-pointer" (click)="handleLogoClick()">
          <img src="assets/logo.png"
               alt="Aries Ventures"
               class="h-9 w-9 object-contain"
               style="image-rendering: crisp-edges;">
          <span class="text-lg font-extrabold text-on-surface tracking-tighter font-headline">Aries Ventures</span>
        </div>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-8">
          <a *ngFor="let item of navItems"
             (click)="handleLinkClick(item.id)"
             class="cursor-pointer text-sm font-semibold transition-colors duration-200"
             [class.text-secondary]="activeSection === item.id"
             [class.text-on-surface-variant]="activeSection !== item.id">
            {{ item.label }}
          </a>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <ng-container *ngIf="isAuthenticated">
            <button (click)="goToDashboard()" class="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors">
              <span class="material-symbols-outlined text-base">dashboard</span> Dashboard
            </button>
            <button (click)="logout()" class="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors">
              <span class="material-symbols-outlined text-base">logout</span> Logout
            </button>
          </ng-container>
          <ng-container *ngIf="!isAuthenticated">
            <button (click)="goToLogin()" class="hidden sm:block px-5 py-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors">Login</button>
            <button (click)="goToRegister()" class="px-5 py-2.5 bg-primary-container text-on-primary rounded-full text-sm font-bold hover:bg-primary transition-all active:scale-95">
              Get Started
            </button>
          </ng-container>
          <button (click)="toggleMobileMenu()" class="md:hidden p-2 text-on-surface-variant">
            <span class="material-symbols-outlined">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div *ngIf="mobileMenuOpen"
         class="md:hidden fixed top-[65px] left-0 w-full bg-surface-container-low border-b border-outline-variant/10 z-40 shadow-xl">
      <div class="px-8 py-6 space-y-1">
        <button *ngFor="let item of navItems"
                (click)="handleLinkClick(item.id); toggleMobileMenu()"
                class="block w-full text-left py-3 text-base font-semibold transition-colors"
                [class.text-secondary]="activeSection === item.id"
                [class.text-on-surface]="activeSection !== item.id">
          {{ item.label }}
        </button>
        <div class="border-t border-outline-variant/20 pt-4 mt-2 grid grid-cols-2 gap-3">
          <ng-container *ngIf="!isAuthenticated">
            <button (click)="goToLogin(); toggleMobileMenu()" class="py-3 bg-surface-container rounded-full text-sm font-bold text-on-surface text-center">Login</button>
            <button (click)="goToRegister(); toggleMobileMenu()" class="py-3 bg-primary-container text-on-primary rounded-full text-sm font-bold text-center">Sign Up</button>
          </ng-container>
          <ng-container *ngIf="isAuthenticated">
            <button (click)="goToDashboard(); toggleMobileMenu()" class="py-3 bg-surface-container rounded-full text-sm font-bold text-on-surface text-center col-span-2">Dashboard</button>
          </ng-container>
        </div>
      </div>
    </div>
  `
})
export class NavComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  @Input() navItems: { id: string, label: string }[] = [];
  @Input() activeSection: string = '';
  @Output() linkClick = new EventEmitter<string>();

  mobileMenuOpen = false;
  isAuthenticated = false;

  ngOnInit() {
    this.authService.authState$.subscribe(state => {
      this.isAuthenticated = state.isAuthenticated;
    });
  }

  handleLogoClick() {
    this.linkClick.emit('home');
  }

  handleLinkClick(id: string) {
    this.linkClick.emit(id);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout();
  }
}
