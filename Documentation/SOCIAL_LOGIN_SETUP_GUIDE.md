# Social Login Setup Guide - Aries Ventures

## 🚀 **Simple Social Login Implementation**

This guide will help you set up Google and Facebook OAuth login for your Aries Ventures website. This implementation uses direct OAuth APIs (no Auth0 required) for a simpler, cost-effective solution.

---

## 📋 **Prerequisites**

- Google Developer Account
- Facebook Developer Account
- Domain name (for production)

---

## 🔵 **Google OAuth Setup**

### **Step 1: Create Google Cloud Project**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Name it "Aries Ventures" or similar

### **Step 2: Enable Google+ API**

1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API" and enable it
3. Also enable "Google Identity" if available

### **Step 3: Create OAuth 2.0 Credentials**

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Configure consent screen first if prompted:
   - **Application name**: Aries Ventures
   - **User support email**: your-email@domain.com
   - **Developer contact**: your-email@domain.com
4. Create OAuth client:
   - **Application type**: Web application
   - **Name**: Aries Ventures Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:4200` (development)
     - `https://yourdomain.com` (production)
   - **Authorized redirect URIs**:
     - `http://localhost:4200/login` (development)
     - `https://yourdomain.com/login` (production)

### **Step 4: Get Client ID**

1. Copy the **Client ID** (looks like: `1234567890-abc...xyz.apps.googleusercontent.com`)
2. Update `frontend/src/environments/environment.ts`:
   ```typescript
   googleClientId: 'YOUR_ACTUAL_GOOGLE_CLIENT_ID_HERE'
   ```

---

## 📘 **Facebook OAuth Setup**

### **Step 1: Create Facebook App**

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Choose **Consumer** app type
4. **App Name**: Aries Ventures
5. **Contact Email**: your-email@domain.com

### **Step 2: Add Facebook Login Product**

1. In your app dashboard, click **Add Product**
2. Find **Facebook Login** and click **Set Up**
3. Choose **Web** platform

### **Step 3: Configure Facebook Login**

1. Go to **Facebook Login** → **Settings**
2. **Valid OAuth Redirect URIs**:
   - `http://localhost:4200/login` (development)
   - `https://yourdomain.com/login` (production)
3. **Valid OAuth Redirect URIs for Web Games**: Leave empty
4. **Deauthorize Callback URL**: Leave empty for now

### **Step 4: Get App ID**

1. Go to **Settings** → **Basic**
2. Copy the **App ID** (looks like: `1234567890123456`)
3. Update `frontend/src/environments/environment.ts`:
   ```typescript
   facebookAppId: 'YOUR_ACTUAL_FACEBOOK_APP_ID_HERE'
   ```

### **Step 5: App Review (For Production)**

For production, you'll need to submit your app for review to access user emails:
1. Go to **App Review** → **Permissions and Features**
2. Request **email** permission
3. Provide use case explanation

---

## ⚙️ **Configuration Files**

### **Development Environment**
Update `frontend/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  frontendUrl: 'http://localhost:4200',
  
  // Replace with your actual credentials
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  facebookAppId: 'YOUR_FACEBOOK_APP_ID',
  
  // Feature Flags
  enableSocialLogin: true,
  enableGoogleLogin: true,
  enableFacebookLogin: true,
  
  // Legacy Auth0 (can be removed later)
  auth0: {
    domain: 'dev-aries-ventures.auth0.com',
    clientId: 'dev-client-id',
    audience: 'https://your-auth0-domain.auth0.com/api/v2/'
  }
};
```

### **Production Environment**
Update `frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api',
  frontendUrl: 'https://yourdomain.com',
  
  // Replace with your actual production credentials
  googleClientId: 'YOUR_PRODUCTION_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  facebookAppId: 'YOUR_PRODUCTION_FACEBOOK_APP_ID',
  
  // Feature Flags
  enableSocialLogin: true,
  enableGoogleLogin: true,
  enableFacebookLogin: true,
  
  // Legacy Auth0 (can be removed later)
  auth0: {
    domain: 'aries-ventures.auth0.com',
    clientId: 'prod-client-id',
    audience: 'https://api.yourdomain.com'
  }
};
```

---

## 🧪 **Testing Social Login**

### **Development Testing**

1. Start your servers:
   ```bash
   # Backend
   cd backend && python3 manage.py runserver
   
   # Frontend
   cd frontend && ng serve
   ```

2. Go to `http://localhost:4200/login`
3. Click **Google** or **Facebook** buttons
4. Complete OAuth flow
5. Check browser console for any errors

### **Common Issues & Solutions**

#### **Google Login Issues**
- **"Invalid client"**: Check Client ID is correct
- **"Redirect URI mismatch"**: Ensure redirect URIs match exactly
- **"Access blocked"**: Configure OAuth consent screen

#### **Facebook Login Issues**
- **"App not setup"**: Ensure Facebook Login product is added
- **"Invalid redirect URI"**: Check redirect URIs in Facebook settings
- **"Email permission denied"**: Submit app for review or use test users

---

## 🔒 **Security Considerations**

### **Client ID Security**
- Client IDs are public and safe to expose in frontend code
- Never expose Client Secrets in frontend code
- Use environment variables for production

### **Domain Restrictions**
- Always restrict OAuth to your specific domains
- Never use wildcards in production
- Regularly review authorized domains

### **User Data**
- Only request necessary permissions (email, profile)
- Inform users what data you're accessing
- Comply with GDPR/privacy regulations

---

## 🚀 **Deployment Checklist**

### **Before Going Live**

- [ ] Replace placeholder Client IDs with real ones
- [ ] Configure production domains in OAuth settings
- [ ] Test social login on staging environment
- [ ] Submit Facebook app for review (if needed)
- [ ] Set up proper error logging
- [ ] Configure HTTPS for production

### **Production Domains**
Make sure to add your production domain to:
- Google Cloud Console → Credentials → Authorized origins
- Facebook Developers → App Settings → Valid OAuth Redirect URIs

---

## 📊 **Current Implementation Status**

### **✅ Completed Features**
- Direct Google OAuth integration (no Auth0)
- Direct Facebook OAuth integration (no Auth0)
- Backend social login endpoint (`/api/auth/social-login/`)
- Automatic user creation/login
- JWT token generation
- Error handling and user feedback
- Mobile-responsive social login buttons

### **🔧 Configuration Needed**
- Replace placeholder Google Client ID
- Replace placeholder Facebook App ID
- Configure OAuth redirect URIs
- Test with real credentials

### **💡 Benefits of This Approach**
- **No monthly fees** (unlike Auth0)
- **Faster performance** (fewer redirects)
- **Full control** over user experience
- **Simpler maintenance** (fewer dependencies)
- **Better debugging** (direct API calls)

---

## 🆘 **Support & Troubleshooting**

### **Google OAuth Documentation**
- [Google Identity Platform](https://developers.google.com/identity)
- [OAuth 2.0 for Web Applications](https://developers.google.com/identity/protocols/oauth2/web-server)

### **Facebook OAuth Documentation**
- [Facebook Login for the Web](https://developers.facebook.com/docs/facebook-login/web)
- [Facebook JavaScript SDK](https://developers.facebook.com/docs/javascript)

### **Common Error Codes**
- **400**: Invalid request (check parameters)
- **401**: Unauthorized (check credentials)
- **403**: Forbidden (check permissions)
- **404**: Endpoint not found (check URLs)

---

*Once you've configured the OAuth credentials, your social login will be fully functional! Users will be able to sign in with Google and Facebook seamlessly.*