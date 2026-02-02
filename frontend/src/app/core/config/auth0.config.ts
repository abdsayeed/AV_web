import { AuthConfig } from '@auth0/auth0-angular';

export const auth0Config: AuthConfig = {
  domain: 'your-auth0-domain.auth0.com', // Replace with your Auth0 domain
  clientId: 'your-auth0-client-id', // Replace with your Auth0 client ID
  authorizationParams: {
    redirect_uri: window.location.origin + '/callback',
    audience: 'https://your-auth0-domain.auth0.com/api/v2/', // Replace with your Auth0 API identifier
    scope: 'openid profile email offline_access'
  },
  httpInterceptor: {
    allowedList: [
      {
        uri: 'http://localhost:8000/api/*',
        tokenOptions: {
          authorizationParams: {
            audience: 'https://your-auth0-domain.auth0.com/api/v2/',
            scope: 'openid profile email'
          }
        }
      }
    ]
  }
};

// Environment-specific configurations
export const auth0ConfigDev: AuthConfig = {
  ...auth0Config,
  domain: 'dev-aries-ventures.auth0.com', // Development domain
  clientId: 'dev-client-id', // Development client ID
};

export const auth0ConfigProd: AuthConfig = {
  ...auth0Config,
  domain: 'aries-ventures.auth0.com', // Production domain
  clientId: 'prod-client-id', // Production client ID
};