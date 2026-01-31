import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
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
                      class="text-white px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 flex items-center gap-2">
                <span class="material-symbols-outlined text-lg">dashboard</span>
                Dashboard
              </button>
              <button (click)="goToProfile()" 
                      class="text-blue-300 hover:text-white transition-colors flex items-center gap-2">
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
              <span class="hidden sm:block text-blue-200 text-sm">{{ user?.name || 'User' }}</span>
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
                    class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium bg-blue-600 text-white flex items-center gap-3">
              <span class="material-symbols-outlined text-lg">dashboard</span>
              Dashboard
            </button>
            <button (click)="goToProfile(); toggleMobileMenu()"
                    class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-blue-200 hover:bg-blue-800 hover:text-white transition-all duration-300 flex items-center gap-3">
              <span class="material-symbols-outlined text-lg">person</span>
              Profile
            </button>
            <div class="border-t border-blue-800/50 pt-3 mt-3">
              <div class="px-4 py-2 text-blue-200 text-sm">
                {{ user?.name || 'User' }}
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
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- Welcome Section -->
        <div class="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 mb-8">
          <h1 class="text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <span class="material-symbols-outlined text-4xl">celebration</span>
            Welcome to Your Dashboard!
          </h1>
          <p class="text-blue-200 text-lg">
            Manage your projects, view submissions, and track your business growth.
          </p>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          <!-- New Project -->
          <div class="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all cursor-pointer"
               (click)="startNewProject()">
            <div class="mb-4">
              <span class="material-symbols-outlined text-4xl text-blue-400">rocket_launch</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Start New Project</h3>
            <p class="text-blue-200">Begin a new website project inquiry</p>
          </div>

          <!-- View Templates -->
          <div class="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all cursor-pointer"
               (click)="viewTemplates()">
            <div class="mb-4">
              <span class="material-symbols-outlined text-4xl text-purple-400">palette</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Browse Templates</h3>
            <p class="text-blue-200">Explore our website templates</p>
          </div>

          <!-- Contact Support -->
          <div class="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all cursor-pointer"
               (click)="contactSupport()">
            <div class="mb-4">
              <span class="material-symbols-outlined text-4xl text-green-400">chat</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Contact Support</h3>
            <p class="text-blue-200">Get help with your projects</p>
          </div>

        </div>

        <!-- Recent Activity -->
        <div class="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
          <h2 class="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          
          <div *ngIf="!hasActivity" class="text-center py-12">
            <div class="mb-4">
              <span class="material-symbols-outlined text-6xl text-blue-400">assignment</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">No Activity Yet</h3>
            <p class="text-blue-200 mb-6">Start your first project to see activity here</p>
            <button (click)="startNewProject()"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors">
              Start Your First Project
            </button>
          </div>

          <!-- Activity items would go here when backend is connected -->
          
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
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  user: any = null;
  hasActivity = false;
  mobileMenuOpen = false;

  ngOnInit() {
    // Subscribe to current user
    this.apiService.currentUser$.subscribe(user => {
      this.user = user;
    });

    // Load user data if not already loaded
    if (this.apiService.isAuthenticated()) {
      this.loadUserData();
    }
  }

  private loadUserData() {
    // This will be implemented when backend is ready
    // For now, we'll use the stored user data
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, we'd call this.apiService.getCurrentUser()
      console.log('Loading user data...');
    }
  }

  startNewProject() {
    this.router.navigate(['/contact']);
  }

  viewTemplates() {
    this.router.navigate(['/'], { fragment: 'templates' });
  }

  contactSupport() {
    this.router.navigate(['/contact'], { 
      queryParams: { 
        source: 'dashboard',
        goal: 'consultation' 
      }
    });
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToDashboard() {
    // Already on dashboard, do nothing or refresh
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  logout() {
    this.apiService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Force logout even if API call fails
        localStorage.removeItem('token');
        this.router.navigate(['/']);
      }
    });
  }
}