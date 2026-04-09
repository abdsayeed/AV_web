import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService, User } from './api.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    is_verified: true,
    created_at: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const apiServiceSpyObj = jasmine.createSpyObj('ApiService', [
      'login',
      'register',
      'logout',
      'getProfile',
      'requestPasswordReset',
      'changePassword'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpyObj },
        { provide: ApiService, useValue: apiServiceSpyObj }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Email Validation', () => {
    it('should reject invalid email format', (done) => {
      service.loginWithCustom('invalid-email', 'password123').subscribe({
        error: (error) => {
          expect(error.message).toContain('valid email');
          done();
        }
      });
    });

    it('should accept valid email format', () => {
      const mockResponse = {
        success: true,
        message: 'Login successful',
        tokens: { access: 'token123', refresh: 'refresh123' },
        user: mockUser
      };

      apiServiceSpy.login.and.returnValue(
        new Observable((observer) => {
          observer.next(mockResponse);
          observer.complete();
        })
      );

      service.loginWithCustom('test@example.com', 'password123').subscribe({
        next: (response) => {
          expect(response.success).toBe(true);
        }
      });
    });
  });

  describe('Password Validation', () => {
    it('should reject password shorter than 6 characters', (done) => {
      service.loginWithCustom('test@example.com', '12345').subscribe({
        error: (error) => {
          expect(error.message).toContain('at least 6 characters');
          done();
        }
      });
    });

    it('should reject empty password', (done) => {
      service.loginWithCustom('test@example.com', '').subscribe({
        error: (error) => {
          expect(error.message).toContain('at least 6 characters');
          done();
        }
      });
    });
  });

  describe('Authentication State', () => {
    it('should initialize with unauthenticated state', (done) => {
      service.authState$.subscribe(state => {
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        done();
      });
    });

    it('should return current authentication status', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return current user', () => {
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should return current token', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('Logout', () => {
    it('should clear localStorage on logout', (done) => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('accessToken', 'test-token');
      localStorage.setItem('refreshToken', 'refresh-token');

      apiServiceSpy.logout.and.returnValue(
        new Observable((observer) => {
          observer.next({ success: true });
          observer.complete();
        })
      );

      service.logout();

      // Wait for async operations
      setTimeout(() => {
        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('accessToken')).toBeNull();
        expect(localStorage.getItem('refreshToken')).toBeNull();
        done();
      }, 100);
    });

    it('should navigate to home on logout', (done) => {
      apiServiceSpy.logout.and.returnValue(
        new Observable((observer) => {
          observer.next({ success: true });
          observer.complete();
        })
      );

      service.logout();

      setTimeout(() => {
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
        done();
      }, 100);
    });
  });

  describe('Password Reset', () => {
    it('should reject invalid email for password reset', (done) => {
      service.resetPassword('invalid-email').subscribe({
        error: (error) => {
          expect(error.message).toContain('valid email');
          done();
        }
      });
    });
  });

  describe('Change Password', () => {
    it('should reject empty passwords', (done) => {
      service.changePassword('', '').subscribe({
        error: (error) => {
          expect(error.message).toContain('fill in all password fields');
          done();
        }
      });
    });

    it('should reject short new password', (done) => {
      service.changePassword('oldpass123', 'short').subscribe({
        error: (error) => {
          expect(error.message).toContain('at least 8 characters');
          done();
        }
      });
    });

    it('should reject same old and new password', (done) => {
      service.changePassword('password123', 'password123').subscribe({
        error: (error) => {
          expect(error.message).toContain('must be different');
          done();
        }
      });
    });
  });
});
