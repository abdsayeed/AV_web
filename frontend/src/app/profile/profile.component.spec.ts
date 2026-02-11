import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { ProfileComponent } from './profile.component';
import { AuthService } from '../core/services/auth.service';
import { ApiService, User } from '../core/services/api.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let currentUserSubject: BehaviorSubject<User | null>;

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

  beforeEach(async () => {
    currentUserSubject = new BehaviorSubject<User | null>(mockUser);
    
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout', 'changePassword']);
    const apiSpy = jasmine.createSpyObj('ApiService', ['updateProfile', 'changePassword', 'isAuthenticated'], {
      currentUser$: currentUserSubject.asObservable()
    });
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, FormsModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Profile Loading', () => {
    it('should load user profile on init', () => {
      apiServiceSpy.isAuthenticated.and.returnValue(true);

      component.ngOnInit();

      expect(component.profileData.name).toBe('Test User');
      expect(component.profileData.email).toBe('test@example.com');
    });

    it('should handle null user', () => {
      currentUserSubject.next(null);

      component.ngOnInit();

      expect(component.profileData.name).toBe('');
    });
  });

  describe('Profile Update', () => {
    beforeEach(() => {
      component.profileData = {
        name: 'Test User',
        email: 'test@example.com',
        businessName: 'Test Business',
        phone: '1234567890',
        createdAt: new Date()
      };
    });

    it('should validate required fields', () => {
      component.profileData.name = '';
      component.updateProfile();

      expect(component.errorMessage).toContain('required');
      expect(apiServiceSpy.updateProfile).not.toHaveBeenCalled();
    });

    it('should validate email format', () => {
      component.profileData.email = 'invalid-email';
      component.updateProfile();

      expect(component.errorMessage).toContain('valid email');
      expect(apiServiceSpy.updateProfile).not.toHaveBeenCalled();
    });

    it('should update profile successfully', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      apiServiceSpy.updateProfile.and.returnValue(of({
        success: true,
        user: updatedUser,
        message: 'Profile updated'
      }));

      component.updateProfile();

      expect(apiServiceSpy.updateProfile).toHaveBeenCalled();
    });
  });

  describe('Password Change', () => {
    beforeEach(() => {
      component.passwordData = {
        currentPassword: 'OldPass123',
        newPassword: 'NewPass123',
        confirmPassword: 'NewPass123'
      };
    });

    it('should validate all password fields are filled', () => {
      component.passwordData.currentPassword = '';
      component.changePassword();

      expect(component.errorMessage).toContain('required');
      expect(authServiceSpy.changePassword).not.toHaveBeenCalled();
    });

    it('should validate new password length', () => {
      component.passwordData.newPassword = 'short';
      component.passwordData.confirmPassword = 'short';
      component.changePassword();

      expect(component.errorMessage).toContain('8 characters');
      expect(authServiceSpy.changePassword).not.toHaveBeenCalled();
    });

    it('should validate passwords match', () => {
      component.passwordData.confirmPassword = 'DifferentPass123';
      component.changePassword();

      expect(component.errorMessage).toContain('do not match');
      expect(authServiceSpy.changePassword).not.toHaveBeenCalled();
    });

    it('should change password successfully', () => {
      authServiceSpy.changePassword.and.returnValue(of({
        success: true,
        message: 'Password changed'
      }));

      component.changePassword();

      expect(authServiceSpy.changePassword).toHaveBeenCalled();
    });
  });

  describe('Password Visibility', () => {
    it('should toggle current password visibility', () => {
      expect(component.showCurrentPassword).toBe(false);
      
      component.toggleCurrentPassword();
      expect(component.showCurrentPassword).toBe(true);
      
      component.toggleCurrentPassword();
      expect(component.showCurrentPassword).toBe(false);
    });

    it('should toggle new password visibility', () => {
      expect(component.showNewPassword).toBe(false);
      
      component.toggleNewPassword();
      expect(component.showNewPassword).toBe(true);
    });

    it('should toggle confirm password visibility', () => {
      expect(component.showConfirmPassword).toBe(false);
      
      component.toggleConfirmPassword();
      expect(component.showConfirmPassword).toBe(true);
    });
  });

  describe('Logout', () => {
    it('should logout user', () => {
      component.logout();
      expect(authServiceSpy.logout).toHaveBeenCalled();
    });
  });
});
