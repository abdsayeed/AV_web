import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../core/services/auth.service';
import { ApiService, User } from '../core/services/api.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test',
    role: 'user',
    is_verified: true,
    created_at: '2024-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['loginWithCustom', 'resetPassword']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should show error when email is empty', () => {
      component.loginData.email = '';
      component.loginData.password = 'password123';
      component.onSubmit();

      expect(component.errorMessage).toContain('required fields');
      expect(component.isLoading).toBe(false);
    });

    it('should show error when password is empty', () => {
      component.loginData.email = 'test@example.com';
      component.loginData.password = '';
      component.onSubmit();

      expect(component.errorMessage).toContain('required fields');
      expect(component.isLoading).toBe(false);
    });

    it('should show error for invalid email format', () => {
      component.loginData.email = 'invalid-email';
      component.loginData.password = 'password123';
      component.onSubmit();

      expect(component.errorMessage).toContain('valid email');
      expect(component.isLoading).toBe(false);
    });

    it('should trim whitespace from email', () => {
      component.loginData.email = '  test@example.com  ';
      component.loginData.password = 'password123';

      authServiceSpy.loginWithCustom.and.returnValue(of({
        success: true,
        message: 'Login successful',
        tokens: { access: 'token', refresh: 'refresh' },
        user: mockUser
      }));

      component.onSubmit();

      expect(component.loginData.email).toBe('test@example.com');
    });
  });

  describe('Login Submission', () => {
    it('should call authService.loginWithCustom on valid submission', () => {
      component.loginData.email = 'test@example.com';
      component.loginData.password = 'password123';

      authServiceSpy.loginWithCustom.and.returnValue(of({
        success: true,
        message: 'Login successful',
        tokens: { access: 'token', refresh: 'refresh' },
        user: mockUser
      }));

      component.onSubmit();

      expect(authServiceSpy.loginWithCustom).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
    });

    it('should navigate to home on successful login', (done) => {
      component.loginData.email = 'test@example.com';
      component.loginData.password = 'password123';

      authServiceSpy.loginWithCustom.and.returnValue(of({
        success: true,
        message: 'Login successful',
        tokens: { access: 'token', refresh: 'refresh' },
        user: mockUser
      }));

      component.onSubmit();

      setTimeout(() => {
        expect(routerSpy.navigate).toHaveBeenCalled();
        done();
      }, 150);
    });

    it('should show error message on login failure', () => {
      component.loginData.email = 'test@example.com';
      component.loginData.password = 'wrongpassword';

      authServiceSpy.loginWithCustom.and.returnValue(throwError(() => ({
        message: 'Invalid credentials'
      })));

      component.onSubmit();

      expect(component.errorMessage).toContain('Invalid credentials');
      expect(component.isLoading).toBe(false);
    });

    it('should prevent multiple simultaneous submissions', () => {
      component.isLoading = true;
      component.loginData.email = 'test@example.com';
      component.loginData.password = 'password123';

      component.onSubmit();

      expect(authServiceSpy.loginWithCustom).not.toHaveBeenCalled();
    });
  });

  describe('Password Toggle', () => {
    it('should toggle password visibility', () => {
      expect(component.showPassword).toBe(false);
      
      component.togglePassword();
      expect(component.showPassword).toBe(true);
      
      component.togglePassword();
      expect(component.showPassword).toBe(false);
    });
  });

  describe('Forgot Password', () => {
    it('should show error when email is empty', () => {
      component.loginData.email = '';
      component.onForgotPassword();

      expect(component.errorMessage).toContain('enter your email');
    });

    it('should show error for invalid email format', () => {
      component.loginData.email = 'invalid-email';
      component.onForgotPassword();

      expect(component.errorMessage).toContain('valid email');
    });

    it('should call resetPassword with valid email', () => {
      component.loginData.email = 'test@example.com';
      authServiceSpy.resetPassword.and.returnValue(of({ success: true }));

      spyOn(window, 'alert');
      component.onForgotPassword();

      expect(authServiceSpy.resetPassword).toHaveBeenCalledWith('test@example.com');
    });
  });

  describe('Navigation', () => {
    it('should navigate to register page', () => {
      component.goToRegister();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/register']);
    });

    it('should navigate to home page', () => {
      component.goToHome();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
