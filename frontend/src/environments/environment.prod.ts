export const environment = {
  production: true,
  apiUrl: 'https://api.ariesventures.com', // Update with your production API URL
  frontendUrl: 'https://ariesventures.com', // Update with your production frontend URL
  
  // Social Login Configuration (Replace with your actual credentials)
  googleClientId: 'your-production-google-client-id.apps.googleusercontent.com', // Replace with your Google Client ID
  facebookAppId: 'your-production-facebook-app-id', // Replace with your Facebook App ID
  
  // Feature Flags
  enableSocialLogin: true,
  enableGoogleLogin: true,
  enableFacebookLogin: true,
  
  // Legacy Auth0 (can be removed later)
  auth0: {
    domain: 'aries-ventures.auth0.com',
    clientId: 'prod-client-id',
    audience: 'https://api.ariesventures.com'
  }
};