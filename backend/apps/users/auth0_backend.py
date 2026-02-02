import json
import requests
from jose import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend
from django.core.exceptions import ValidationError

User = get_user_model()

class Auth0Backend(BaseBackend):
    """
    Auth0 authentication backend for Django
    """
    
    def authenticate(self, request, token=None, **kwargs):
        """
        Authenticate user with Auth0 JWT token
        """
        if not token:
            return None
            
        try:
            # Decode and verify the token
            user_info = self.verify_token(token)
            if not user_info:
                return None
                
            # Get or create user
            user = self.get_or_create_user(user_info)
            return user
            
        except Exception as e:
            print(f"Auth0 authentication error: {e}")
            return None
    
    def verify_token(self, token):
        """
        Verify Auth0 JWT token
        """
        try:
            # Get Auth0 public key
            jwks_url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
            jwks = requests.get(jwks_url).json()
            
            # Get the key ID from token header
            unverified_header = jwt.get_unverified_header(token)
            rsa_key = {}
            
            for key in jwks["keys"]:
                if key["kid"] == unverified_header["kid"]:
                    rsa_key = {
                        "kty": key["kty"],
                        "kid": key["kid"],
                        "use": key["use"],
                        "n": key["n"],
                        "e": key["e"]
                    }
                    break
            
            if not rsa_key:
                raise ValidationError("Unable to find appropriate key")
            
            # Verify and decode the token
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                audience=settings.AUTH0_API_IDENTIFIER,
                issuer=f"https://{settings.AUTH0_DOMAIN}/"
            )
            
            return payload
            
        except jwt.ExpiredSignatureError:
            raise ValidationError("Token has expired")
        except jwt.JWTClaimsError:
            raise ValidationError("Invalid token claims")
        except Exception as e:
            raise ValidationError(f"Token verification failed: {str(e)}")
    
    def get_or_create_user(self, user_info):
        """
        Get or create user from Auth0 user info
        """
        auth0_sub = user_info.get('sub')
        email = user_info.get('email')
        
        if not auth0_sub or not email:
            raise ValidationError("Missing required user information")
        
        try:
            # Try to find existing user by Auth0 sub
            user = User.objects.get(auth0_sub=auth0_sub)
            
            # Update user info if needed
            self.update_user_info(user, user_info)
            return user
            
        except User.DoesNotExist:
            # Try to find by email
            try:
                user = User.objects.get(email=email)
                # Link existing user to Auth0
                user.auth0_sub = auth0_sub
                user.auth_provider = 'auth0'
                self.update_user_info(user, user_info)
                user.save()
                return user
                
            except User.DoesNotExist:
                # Create new user
                return self.create_user_from_auth0(user_info)
    
    def create_user_from_auth0(self, user_info):
        """
        Create new user from Auth0 user info
        """
        user_data = {
            'email': user_info.get('email'),
            'name': user_info.get('name', ''),
            'auth0_sub': user_info.get('sub'),
            'auth_provider': 'auth0',
            'is_verified': user_info.get('email_verified', False),
            'avatar': user_info.get('picture', ''),
        }
        
        # Extract name parts
        name = user_info.get('name', '')
        if name:
            name_parts = name.split(' ', 1)
            user_data['first_name'] = name_parts[0]
            if len(name_parts) > 1:
                user_data['last_name'] = name_parts[1]
        
        # Create user without password (Auth0 handles authentication)
        user = User.objects.create_user(
            email=user_data['email'],
            name=user_data['name'],
            password=None,  # No password for Auth0 users
            **{k: v for k, v in user_data.items() if k not in ['email', 'name']}
        )
        
        return user
    
    def update_user_info(self, user, user_info):
        """
        Update user information from Auth0
        """
        updated = False
        
        # Update name if changed
        name = user_info.get('name', '')
        if name and user.name != name:
            user.name = name
            updated = True
        
        # Update avatar if changed
        picture = user_info.get('picture', '')
        if picture and user.avatar != picture:
            user.avatar = picture
            updated = True
        
        # Update verification status
        email_verified = user_info.get('email_verified', False)
        if email_verified and not user.is_verified:
            user.is_verified = True
            updated = True
        
        if updated:
            user.save()
    
    def get_user(self, user_id):
        """
        Get user by ID
        """
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None