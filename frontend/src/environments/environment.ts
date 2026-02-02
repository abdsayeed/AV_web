export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  frontendUrl: 'http://localhost:4200',
  auth0: {
    domain: 'dev-aries-ventures.auth0.com', // Update with your Auth0 domain
    clientId: 'dev-client-id', // Update with your Auth0 client ID
    audience: 'https://your-auth0-domain.auth0.com/api/v2/' // Update with your Auth0 API identifier
  }
};