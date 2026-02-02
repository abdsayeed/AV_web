# Auth0 + JWT Integration Guide

## 🔐 Overview

This guide explains how to set up Auth0 authentication alongside the existing custom JWT system in Aries Ventures. The integration provides:

- **Dual Authentication**: Support for both Auth0 and custom JWT
- **Social Logins**: Google, Facebook, and other providers via Auth0
- **Enterprise Security**: Auth0's enterprise-grade security features
- **Seamless Migration**: Existing users can continue using custom auth
- **Unified User Management**: Single user database for both auth methods

## 🚀 Features Implemented

### Frontend (Angular)
- ✅ Auth0 Angular SDK integration
- ✅ Enhanced login component with social login options
- ✅ Unified authentication service supporting both Auth0 and custom JWT
- ✅ Auth0 callback handling
- ✅ Automatic user synchronization
- ✅ Token management and refresh

### Backend (Django)
- ✅ Auth0 JWT verification backend
- ✅ User model extended with Auth0 fields
- ✅ Auth0 user synchronization endpoints
- ✅ Dual authentication backend support
- ✅ Database migrations for Auth0 fields

## 📋 Setup Instructions

### 1. Auth0 Dashboard Setup

1. **Create Auth0 Account**
   - Go to [auth0.com](https://auth0.com) and create an account
   - Create a new tenant for your application

2. **Create Application**
   - Go to Applications → Create Application
   - Choose "Single Page Application" (SPA)
   - Select Angular as the technology

3. **Configure Application Settings**
   ```
   Name: Aries Ventures
   Domain: your-domain.auth0.com
   Client ID: [Generated automatically]
   Client Secret: [Generated automatically]
   
   Allowed Callback URLs:
   http://localhost:4200/callback
   https://yourdomain.com/callback
   
   Allowed Logout URLs:
   http://localhost:4200
   https://yourdomain.com
   
   Allowed Web Origins:
   http://localhost:4200
   https://yourdomain.com
   ```

4. **Create API**
   - Go to APIs → Create API
   - Name: Aries Ventures API
   - Identifier: https://your-domain.auth0.com/api/v2/
   - Signing Algorithm: RS256

5. **Configure Social Connections**
   - Go to Authentication → Social
   - Enable Google, Facebook, or other providers
   - Configure with your OAuth app credentials

### 2. Environment Configuration

#### Frontend Environment
Update `frontend/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  auth0: {
    domain: 'your-domain.auth0.com',
    clientId: 'your-client-id',
    audience: 'https://your-domain.auth0.com/api/v2/',
    redirectUri: window.location.origin + '/callback'
  }
};
```

#### Backend Environment
Update `backend/.env`:
```env
# Auth0 Configuration
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_API_IDENTIFIER=https://your-domain.auth0.com/api/v2/
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
```

### 3. Update Auth0 Configuration

Update `frontend/src/app/core/config/auth0.config.ts`:
```typescript
export const auth0Config: AuthConfig = {
  domain: 'your-actual-domain.auth0.com',
  clientId: 'your-actual-client-id',
  authorizationParams: {
    redirect_uri: window.location.origin + '/callback',
    audience: 'https://your-actual-domain.auth0.com/api/v2/',
    scope: 'openid profile email offline_access'
  },
  // ... rest of config
};
```

## 🔧 Usage Examples

### Frontend Usage

#### Login with Auth0
```typescript
// In any component
constructor(private authService: AuthService) {}

// Auth0 Universal Login
loginWithAuth0() {
  this.authService.loginWithAuth0();
}

// Google Login via Auth0
loginWithGoogle() {
  this.authService.loginWithGoogle();
}

// Facebook Login via Auth0
loginWithFacebook() {
  this.authService.loginWithFacebook();
}

// Custom JWT Login (existing)
loginWithCustom() {
  this.authService.loginWithCustom(email, password).subscribe(
    response => console.log('Logged in:', response),
    error => console.error('Login failed:', error)
  );
}
```

#### Check Authentication Status
```typescript
// Subscribe to auth state
this.authService.authState$.subscribe(state => {
  console.log('Is authenticated:', state.isAuthenticated);
  console.log('User:', state.user);
  console.log('Provider:', state.provider); // 'auth0' or 'custom'
});

// Get current user
const user = this.authService.getCurrentUser();
const provider = this.authService.getAuthProvider();
```

### Backend Usage

#### Auth0 User Sync Endpoint
```python
POST /api/auth/auth0/sync/
{
  "email": "user@example.com",
  "name": "John Doe",
  "auth0_sub": "auth0|123456789",
  "picture": "https://avatar.url",
  "email_verified": true
}
```

#### Auth0 Token Validation
```python
POST /api/auth/auth0/validate/
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIs..."
}
```

## 🔄 User Flow

### New User Registration via Auth0
1. User clicks "Continue with Auth0" or social login
2. Redirected to Auth0 Universal Login
3. User completes authentication
4. Redirected back to `/callback`
5. Frontend receives Auth0 token
6. Frontend calls `/api/auth/auth0/sync/` to create/sync user
7. User is logged in and redirected to dashboard

### Existing User Login
1. **Custom JWT Users**: Continue using email/password
2. **Auth0 Users**: Use Auth0 login methods
3. **Migration**: Existing users can link their account to Auth0

### Account Linking
- Existing users can link their account to Auth0 by email matching
- Auth0 sub is added to existing user record
- User can then use either authentication method

## 🛡️ Security Features

### Auth0 Security
- ✅ Enterprise-grade security
- ✅ Multi-factor authentication (MFA)
- ✅ Anomaly detection
- ✅ Breached password detection
- ✅ Bot detection
- ✅ GDPR compliance

### JWT Verification
- ✅ RS256 signature verification
- ✅ Token expiration validation
- ✅ Audience validation
- ✅ Issuer validation
- ✅ Public key rotation support

### Database Security
- ✅ Separate auth provider tracking
- ✅ No password storage for Auth0 users
- ✅ User activity logging
- ✅ Session management

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure Auth0 application has correct allowed origins
   - Check Django CORS settings

2. **Token Validation Fails**
   - Verify Auth0 domain and API identifier
   - Check token expiration
   - Ensure correct audience in token

3. **User Sync Issues**
   - Check Auth0 user info structure
   - Verify email uniqueness constraints
   - Check database migrations

4. **Callback Errors**
   - Ensure callback URL is registered in Auth0
   - Check route configuration
   - Verify Auth0 configuration

### Debug Mode
Enable debug logging in Django settings:
```python
LOGGING = {
    'loggers': {
        'apps.users.auth0_backend': {
            'level': 'DEBUG',
        },
    },
}
```

## 📊 Monitoring

### User Analytics
- Track authentication method usage
- Monitor login success/failure rates
- Analyze user registration sources
- Track social login preferences

### Performance Metrics
- Auth0 response times
- Token validation performance
- User sync operation metrics
- Database query optimization

## 🚀 Production Deployment

### Auth0 Production Setup
1. Create production Auth0 tenant
2. Configure production domains and URLs
3. Set up custom domain (optional)
4. Configure production social connections
5. Enable security features (MFA, anomaly detection)

### Environment Variables
```env
# Production Auth0
AUTH0_DOMAIN=production-domain.auth0.com
AUTH0_API_IDENTIFIER=https://api.ariesventures.com
AUTH0_CLIENT_ID=prod-client-id
AUTH0_CLIENT_SECRET=prod-client-secret
```

### Security Checklist
- [ ] Enable MFA for admin accounts
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerts
- [ ] Review Auth0 security policies
- [ ] Test token refresh flows
- [ ] Verify logout functionality
- [ ] Test account linking scenarios

## 📚 Additional Resources

- [Auth0 Angular SDK Documentation](https://auth0.com/docs/libraries/auth0-angular)
- [Auth0 Django Integration](https://auth0.com/docs/quickstart/backend/django)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Auth0 Security Features](https://auth0.com/security)

## 🎯 Next Steps

1. **Set up Auth0 account and configure applications**
2. **Update environment variables with real Auth0 credentials**
3. **Test authentication flows in development**
4. **Configure social login providers**
5. **Set up production Auth0 tenant**
6. **Implement user migration strategy**
7. **Monitor and optimize performance**

The Auth0 integration is now ready for production use with enterprise-grade security and seamless user experience!