import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService, AuthResponse, ApiResponse, User } from './api.service';
import { environment } from '../../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    business_name: 'Test Business',
    phone: '1234567890',
    role: 'user',
    is_verified: true,
    created_at: '2024-01-01T00:00:00Z'
  };

  const mockAuthResponse: AuthResponse = {
    success: true,
    message: 'Success',
    user: mockUser,
    tokens: {
      access: 'access-token-123',
      refresh: 'refresh-token-456'
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Authentication Methods', () => {
    describe('register', () => {
      it('should register a new user', () => {
        const userData = {
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123',
          confirm_password: 'Password123',
          business_name: 'Test Business'
        };

        service.register(userData).subscribe(response => {
          expect(response.success).toBe(true);
          expect(response.user.email).toBe('test@example.com');
          expect(localStorage.getItem('accessToken')).toBe('access-token-123');
          expect(localStorage.getItem('refreshToken')).toBe('refresh-token-456');
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/register/`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(userData);
        req.flush(mockAuthResponse);
      });

      it('should handle registration errors', () => {
        const userData = {
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123',
          confirm_password: 'Password123'
        };

        service.register(userData).subscribe({
          error: (error) => {
            expect(error.message).toContain('Email already exists');
          }
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/register/`);
        req.flush(
          { message: 'Email already exists' },
          { status: 400, statusText: 'Bad Request' }
        );
      });
    });

    describe('login', () => {
      it('should login a user', () => {
        const credentials = {
          email: 'test@example.com',
          password: 'Password123'
        };

        service.login(credentials).subscribe(response => {
          expect(response.success).toBe(true);
          expect(response.user.email).toBe('test@example.com');
          expect(localStorage.getItem('accessToken')).toBe('access-token-123');
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/login/`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(credentials);
        req.flush(mockAuthResponse);
      });

      it('should handle login errors', () => {
        const credentials = {
          email: 'test@example.com',
          password: 'wrongpassword'
        };

        service.login(credentials).subscribe({
          error: (error) => {
            expect(error.message).toContain('Invalid credentials');
          }
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/login/`);
        req.flush(
          { message: 'Invalid credentials' },
          { status: 401, statusText: 'Unauthorized' }
        );
      });
    });

    describe('logout', () => {
      it('should logout a user', () => {
        localStorage.setItem('refreshToken', 'refresh-token-456');

        service.logout().subscribe(response => {
          expect(response.success).toBe(true);
          expect(localStorage.getItem('accessToken')).toBeNull();
          expect(localStorage.getItem('refreshToken')).toBeNull();
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout/`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ refresh_token: 'refresh-token-456' });
        req.flush({ success: true });
      });
    });

    describe('getProfile', () => {
      it('should get user profile', () => {
        service.getProfile().subscribe(response => {
          expect(response.success).toBe(true);
          expect(response.user.email).toBe('test@example.com');
          expect(localStorage.getItem('currentUser')).toBeTruthy();
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/profile/`);
        expect(req.request.method).toBe('GET');
        req.flush({ success: true, user: mockUser });
      });
    });

    describe('updateProfile', () => {
      it('should update user profile', () => {
        const updates = { name: 'Updated Name' };

        service.updateProfile(updates).subscribe(response => {
          expect(response.success).toBe(true);
          expect(response.user.name).toBe('Updated Name');
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/profile/`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(updates);
        req.flush({
          success: true,
          user: { ...mockUser, name: 'Updated Name' },
          message: 'Profile updated'
        });
      });
    });

    describe('changePassword', () => {
      it('should change password', () => {
        const passwordData = {
          current_password: 'OldPass123',
          new_password: 'NewPass123',
          confirm_password: 'NewPass123'
        };

        service.changePassword(passwordData).subscribe(response => {
          expect(response.success).toBe(true);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/change-password/`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(passwordData);
        req.flush({ success: true, message: 'Password changed' });
      });
    });

    describe('requestPasswordReset', () => {
      it('should request password reset', () => {
        const email = 'test@example.com';

        service.requestPasswordReset(email).subscribe(response => {
          expect(response.success).toBe(true);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/auth/password-reset/`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ email });
        req.flush({ success: true, message: 'Reset email sent' });
      });
    });
  });

  describe('Contact Form Methods', () => {
    it('should submit contact form', () => {
      const formData = {
        businessName: 'Test Business',
        email: 'test@example.com',
        phone: '1234567890',
        services: ['web-development'],
        budget: '10000-25000',
        timeline: '1-3 months',
        description: 'Test project'
      };

      service.submitContactForm(formData as any).subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.referenceNumber).toBeTruthy();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/contact/submit/`);
      expect(req.request.method).toBe('POST');
      req.flush({
        success: true,
        message: 'Form submitted',
        referenceNumber: 'REF123',
        data: {
          id: '1',
          reference_number: 'REF123',
          business_name: 'Test Business',
          estimated_response_time: '24 hours'
        }
      });
    });
  });

  describe('Email Validation', () => {
    it('should validate correct email', (done) => {
      service.validateEmail('test@example.com').subscribe(result => {
        expect(result.valid).toBe(true);
        expect(result.suggestion).toBeUndefined();
        done();
      });
    });

    it('should reject invalid email', (done) => {
      service.validateEmail('invalid-email').subscribe(result => {
        expect(result.valid).toBe(false);
        done();
      });
    });

    it('should suggest correction for typo', (done) => {
      service.validateEmail('test@gmial.com').subscribe(result => {
        expect(result.valid).toBe(true);
        expect(result.suggestion).toBe('gmail.com');
        done();
      });
    });
  });

  describe('Utility Methods', () => {
    it('should check if user is authenticated', () => {
      expect(service.isAuthenticated()).toBe(false);

      localStorage.setItem('accessToken', 'token-123');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should get current user', () => {
      expect(service.getCurrentUser()).toBeNull();

      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      service.getProfile().subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/profile/`);
      req.flush({ success: true, user: mockUser });

      expect(service.getCurrentUser()).toBeTruthy();
    });

    it('should get auth headers', () => {
      localStorage.setItem('accessToken', 'token-123');
      const headers = service.getAuthHeaders();

      expect(headers.get('Authorization')).toBe('Bearer token-123');
      expect(headers.get('Content-Type')).toBe('application/json');
    });
  });

  describe('Error Handling', () => {
    it('should handle client-side errors', () => {
      service.login({ email: 'test@example.com', password: 'pass' }).subscribe({
        error: (error) => {
          expect(error.message).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login/`);
      req.error(new ErrorEvent('Network error', {
        message: 'Connection failed'
      }));
    });

    it('should handle server-side errors', () => {
      service.login({ email: 'test@example.com', password: 'pass' }).subscribe({
        error: (error) => {
          expect(error.message).toContain('Server error');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login/`);
      req.flush(
        { message: 'Server error' },
        { status: 500, statusText: 'Internal Server Error' }
      );
    });

    it('should handle validation errors', () => {
      service.register({
        name: '',
        email: 'invalid',
        password: 'short',
        confirm_password: 'short'
      }).subscribe({
        error: (error) => {
          expect(error.message).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register/`);
      req.flush(
        {
          errors: {
            email: ['Enter a valid email address'],
            password: ['Password too short']
          }
        },
        { status: 400, statusText: 'Bad Request' }
      );
    });
  });
});
