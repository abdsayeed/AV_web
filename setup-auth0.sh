#!/bin/bash

# Auth0 Setup Script for Aries Ventures
# This script helps configure Auth0 credentials after creating Auth0 account

echo "🔐 Auth0 Setup Script for Aries Ventures"
echo "========================================"
echo ""

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "❌ Backend .env file not found. Creating from example..."
    cp backend/.env.example backend/.env
fi

echo "📝 Please provide your Auth0 credentials:"
echo ""

# Get Auth0 credentials from user
read -p "Auth0 Domain (e.g., your-domain.auth0.com): " AUTH0_DOMAIN
read -p "Auth0 Client ID: " AUTH0_CLIENT_ID
read -p "Auth0 Client Secret: " AUTH0_CLIENT_SECRET
read -p "Auth0 API Identifier (e.g., https://api.ariesventures.com): " AUTH0_API_IDENTIFIER

echo ""
echo "🔧 Updating configuration files..."

# Update backend .env file
echo "# Auth0 Configuration" >> backend/.env
echo "AUTH0_DOMAIN=$AUTH0_DOMAIN" >> backend/.env
echo "AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID" >> backend/.env
echo "AUTH0_CLIENT_SECRET=$AUTH0_CLIENT_SECRET" >> backend/.env
echo "AUTH0_API_IDENTIFIER=$AUTH0_API_IDENTIFIER" >> backend/.env

# Update frontend Auth0 config
cat > frontend/src/app/core/config/auth0.config.ts << EOF
import { AuthConfig } from '@auth0/auth0-angular';

export const auth0Config: AuthConfig = {
  domain: '$AUTH0_DOMAIN',
  clientId: '$AUTH0_CLIENT_ID',
  authorizationParams: {
    redirect_uri: window.location.origin + '/callback',
    audience: '$AUTH0_API_IDENTIFIER',
    scope: 'openid profile email offline_access'
  },
  httpInterceptor: {
    allowedList: [
      {
        uri: 'http://localhost:8000/api/*',
        tokenOptions: {
          authorizationParams: {
            audience: '$AUTH0_API_IDENTIFIER',
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
  domain: '$AUTH0_DOMAIN',
  clientId: '$AUTH0_CLIENT_ID',
};

export const auth0ConfigProd: AuthConfig = {
  ...auth0Config,
  domain: '$AUTH0_DOMAIN', // Update with production domain if different
  clientId: '$AUTH0_CLIENT_ID', // Update with production client ID if different
};
EOF

# Update environment files
cat > frontend/src/environments/environment.ts << EOF
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api',
  frontendUrl: 'http://localhost:4200',
  auth0: {
    domain: '$AUTH0_DOMAIN',
    clientId: '$AUTH0_CLIENT_ID',
    audience: '$AUTH0_API_IDENTIFIER'
  }
};
EOF

cat > frontend/src/environments/environment.prod.ts << EOF
export const environment = {
  production: true,
  apiUrl: 'https://api.ariesventures.com', // Update with your production API URL
  frontendUrl: 'https://ariesventures.com', // Update with your production frontend URL
  auth0: {
    domain: '$AUTH0_DOMAIN',
    clientId: '$AUTH0_CLIENT_ID',
    audience: '$AUTH0_API_IDENTIFIER'
  }
};
EOF

echo ""
echo "✅ Configuration files updated successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your Auth0 application settings:"
echo "   - Allowed Callback URLs: http://localhost:4200/callback"
echo "   - Allowed Logout URLs: http://localhost:4200"
echo "   - Allowed Web Origins: http://localhost:4200"
echo ""
echo "2. Set up social connections in Auth0 dashboard:"
echo "   - Google OAuth (Authentication → Social → Google)"
echo "   - Facebook OAuth (Authentication → Social → Facebook)"
echo ""
echo "3. Restart your development servers:"
echo "   - Backend: cd backend && python manage.py runserver"
echo "   - Frontend: cd frontend && npm start"
echo ""
echo "🎉 Auth0 integration is ready to test!"