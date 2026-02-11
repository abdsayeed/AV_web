import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../core/services/auth.service';
import { ApiService, User } from '../core/services/api.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    is_verified: true,
    created_at: '2024-01-01T00:00:00Z'
  };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['registerWithCustom']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['register']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, FormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should show error when full name is empty', () => {
      component.registerData.fullName = '';
      component.registerData.email = 'test@example.com';
      component.registerData.password = 'Password123';
      component.registerData.confirmPassword = 'Password123';
      component.registerData.agreeToTerms = true;

      component.onSubmit();

      expect(component.errorMessage).toContain('Full name is required');
      expect(component.isLoading).toBe(false);
    });

    it('should show error when name is too short', () => {
      component.registerData.fullName = 'A';
      component.registerData.email = 'test@example.com';
      component.registerData.password = 'Password123';
      component.registerData.confirmPassword = 'Password123';
      component.registerData.agreeToTerms = true;

      component.onSubmit();

      expect(component.errorMessage).toContain('at least 2 characters');
      expect(component.isLoading).toBe(false);
    });

    it('should show error when email is empty', () => {
      component.registerData.fullName = 'Test User';
      component.registerData.email = '';
      component.registerData.password = 'Password123';
      component.registerData.confirmPassword = 'Password123';
      component.registerData.agreeToTerms = true;

      component.onSubmit();

      expect(component.errorMessage).toContain('Email is required');
      expect(component.isLoading).toBe(false);
    });

    it('should show error for invalid email format', () => {
      component.registerData.fullName = 'Test User';
      component.registerData.email = 'invalid-email';
      component.registerData.password = 'Password123';
      component.registerData.confirmPassword = 'Password123';
      component.registerData.agreeToTerms = true;

      component.onSubmit();

      expect(component.errorMessage).toContain('valid email');
      expect(component.isLoading).toBe(false);
    });

    it('should show error when password is empty', () => {
      component.registerData.fullName = 'Test User';
      component.registerData.email = 'test@example.com';
      component.registerData.password = '';
      component.registerData.confirmPassword = '';
      component.registerData.agreeToTerms = true;

      component.onSubmit();

      expect(component.errorMessage).toContain('Password is required');
      expect(component.isLoading).toBe(false);
    });

    it('should show error when password is too short', () => {
      component.registerData.fullName = 'Test User';
      component.registerData.email = 'test@example.com';
      component.registerData.password = 'Pass1';
      component.registerData.confirmPassword = 'Pass1';
      component.registerData.agreeToTerms = true;

      component.onSubmit();

      expect(component.errorMessage).toContain('at least 8 characters');
      expect(component.isLoading).toBe(false);
    });

    it('should show error when password lacks uppercase', () => {
      component.registerData.fullName = 'Test User';
      component.registerData.email = 'test@example.com';
      component.registerData.password = 'password123';
      component.registerData.confirmPassword = 'password123';
      component.registerData.agreeToTerms = true;

      component.onSubmit();

      expect(component.errorMessage).toContain('uppercase, lowercase, and numbers');
      expect(component.isLoading).toBe(false);
    });

    it('should show error when password lacks lowercase', () => {
      component.registerData.fullName = 'Test User';
      component.registerData.email = 'test@example.com';
      component.registerData.password = 'PASSWORD123';
      component.registerData.confirmPassword = 'PASSWORD123';
      component.registerData.agreeToTerms = true;

      component.onSubmit();

      expect(component.errorMessage).toContain('uppercase, lowercase, and numbers');
      expect(component.isLoading).toBe(false);
    });

    it('should show error when password lacks numbers', () => {
      component.registerData.fullName = 'Test User';
      component.registerData.email = 'test@example.com';
      component.registerData.password = 'Password';
      component.registerData.confirmPassword = 'Password';
      component.registerData.agreeToTerms = true;

      component.onSubmit();

      expect(component.errorMessage).toContain('uppercase, lowercase, and numbers');
      expect(component.isLoading).toBe(false);
    });

    it('should show error when passwords do not match', () => {
      component.registerData.fullName = 'Test User';
      component.registerData.email = 'test@example.com';
      component.registerData.password = 'Password123';
      component.registerData.confirmPassword = 'Password456';
      component.registerData.agreeToTerms = true;

      component.onSubmit();

      expect(component.errorMessage).toContain('do not match');
      expect(component.isLoading).toBe(false);
    });

    it('should show error when terms are not agreed', () => {
      component.registerData.fullName = 'Test User';
      component.registerData.email = 'test@example.com';
      component.registerData.password = 'Password123';
      component.registerData.confirmPassword = 'Password123';
      component.registerData.agreeToTerms = false;

      component.onSubmit();

      expect(component.errorMessage).toContain('agree to the terms');
      expect(component.isLoading).toBe(false);
    });

    it('should trim whitespace from inputs', () => {
      component.registerData.fullName = '  Test User  ';
      component.registerData.email = '  test@example.com  ';
      component.registerData.businessName = '  Test Business  ';
      component.registerData.password = 'Password123';
      component.registerData.confirmPassword = 'Password123';
      component.registerData.agreeToTerms = true;

      authServiceSpy.registerWithCustom.and.returnValue(of({
        success: true,
        message: 'Registration successful',
        tokens: { access: 'token', refresh: 'refresh' },
        user: mockUser
      }));

      component.onSubmit();

      expect(component.registerData.fullName).toBe('Test User');
      expect(component.registerData.email).toBe('test@example.com');
      expect(component.registerData.businessName).toBe('Test Business');
    });
  });

  describe('Registration Submission', () => {
    beforeEach(() => {
      component.registerData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        businessName: 'Test Business',
        agreeToTerms: true
      };
    });

    it('should call authService.registerWithCustom on valid submission', () => {
      authServiceSpy.registerWithCustom.and.returnValue(of({
        success: true,
        message: 'Registration successful',
        tokens: { access: 'token', refresh: 'refresh' },
        user: mockUser
      }));

      component.onSubmit();

      expect(authServiceSpy.registerWithCustom).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        confirm_password: 'Password123',
        business_name: 'Test Business',
        marketing_emails: false
      });
    });

    it('should navigate to home on successful registration', () => {
      authServiceSpy.registerWithCustom.and.returnValue(of({
        success: true,
        message: 'Registration successful',
        tokens: { access: 'token', refresh: 'refresh' },
        user: mockUser
      }));

      component.onSubmit();

      expect(component.isLoading).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should show error message on registration failure', () => {
      authServiceSpy.registerWithCustom.and.returnValue(throwError(() => ({
        message: 'Email already exists'
      })));

      component.onSubmit();

      expect(component.errorMessage).toContain('Email already exists');
      expect(component.isLoading).toBe(false);
    });

    it('should prevent multiple simultaneous submissions', () => {
      component.isLoading = true;

      component.onSubmit();

      expect(authServiceSpy.registerWithCustom).not.toHaveBeenCalled();
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

    it('should toggle confirm password visibility', () => {
      expect(component.showConfirmPassword).toBe(false);
      
      component.toggleConfirmPassword();
      expect(component.showConfirmPassword).toBe(true);
      
      component.toggleConfirmPassword();
      expect(component.showConfirmPassword).toBe(false);
    });
  });

  describe('Multi-Step Navigation', () => {
    it('should start at step 1', () => {
      expect(component.currentStep).toBe(1);
    });

    it('should not proceed to step 2 with empty name', () => {
      component.registerData.fullName = '';
      component.registerData.email = 'test@example.com';
      component.currentStep = 1;

      component.nextStep();

      expect(component.currentStep).toBe(1);
      expect(component.errorMessage).toContain('required fields');
    });

    it('should not proceed to step 2 with short name', () => {
      component.registerData.fullName = 'A';
      component.registerData.email = 'test@example.com';
      component.currentStep = 1;

      component.nextStep();

      expect(component.currentStep).toBe(1);
      expect(component.errorMessage).toContain('at least 2 characters');
    });

    it('should not proceed to step 2 with invalid email', () => {
      component.registerData.fullName = 'Test User';
      component.registerData.email = 'invalid-email';
      component.currentStep = 1;

      component.nextStep();

      expect(component.currentStep).toBe(1);
      expect(component.errorMessage).toContain('valid email');
    });

    it('should proceed to step 2 with valid data', () => {
      component.registerData.fullName = 'Test User';
      component.registerData.email = 'test@example.com';
      component.currentStep = 1;

      component.nextStep();

      expect(component.currentStep).toBe(2);
      expect(component.errorMessage).toBe('');
    });

    it('should go back to step 1', () => {
      component.currentStep = 2;

      component.prevStep();

      expect(component.currentStep).toBe(1);
      expect(component.errorMessage).toBe('');
    });

    it('should not go below step 1', () => {
      component.currentStep = 1;

      component.prevStep();

      expect(component.currentStep).toBe(1);
    });
  });

  describe('Navigation', () => {
    it('should navigate to login page', () => {
      component.goToLogin();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should navigate to home page', () => {
      component.goToHome();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
