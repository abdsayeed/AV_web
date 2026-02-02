import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-full mb-6">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
        
        <h1 class="text-2xl font-bold text-white mb-4">
          {{ isLoading ? 'Completing Sign In...' : 'Sign In Complete!' }}
        </h1>
        
        <p class="text-blue-200 mb-6">
          {{ isLoading ? 'Please wait while we set up your account.' : 'Redirecting you to your dashboard.' }}
        </p>
        
        <div *ngIf="error" class="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-200 max-w-md mx-auto">
          <p class="font-medium mb-2">Authentication Error</p>
          <p class="text-sm">{{ error }}</p>
          <button (click)="retryAuth()" 
                  class="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class CallbackComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    // Handle the Auth0 callback
    this.auth.handleRedirectCallback().subscribe({
      next: (result) => {
        console.log('Auth0 callback successful:', result);
        this.isLoading = false;
        
        // Redirect to dashboard or intended page
        const returnUrl = localStorage.getItem('auth_return_url') || '/dashboard';
        localStorage.removeItem('auth_return_url');
        
        setTimeout(() => {
          this.router.navigate([returnUrl]);
        }, 1500);
      },
      error: (error) => {
        console.error('Auth0 callback error:', error);
        this.isLoading = false;
        this.error = error.message || 'Authentication failed. Please try again.';
      }
    });
  }

  retryAuth() {
    this.router.navigate(['/login']);
  }
}