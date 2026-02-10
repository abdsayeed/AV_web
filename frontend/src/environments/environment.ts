export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  frontendUrl: 'http://localhost:4200',
  
  // Social Login Configuration (Replace with your actual credentials)
  googleClientId: '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com', // Replace with your Google Client ID
  facebookAppId: '1234567890123456', // Replace with your Facebook App ID
  
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