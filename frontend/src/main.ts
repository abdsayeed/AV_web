import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';

import { RootComponent } from './app/root.component';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { LoadingInterceptor } from './app/core/interceptors/loading.interceptor';
import { auth0Config } from './app/core/config/auth0.config';
import { environment } from './environments/environment';

// Use Auth0 config from environment
const auth0Configuration = {
  ...auth0Config,
  domain: environment.auth0?.domain || auth0Config.domain,
  clientId: environment.auth0?.clientId || auth0Config.clientId,
  authorizationParams: {
    ...auth0Config.authorizationParams,
    audience: environment.auth0?.audience || auth0Config.authorizationParams?.['audience']
  }
};

bootstrapApplication(RootComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideAuth0(auth0Configuration),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ]
}).catch(err => console.error(err));

