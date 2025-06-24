// src/main.ts
import { bootstrapApplication }           from '@angular/platform-browser';
import { APP_INITIALIZER }                from '@angular/core';
import { provideRouter }                  from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations }              from '@angular/platform-browser/animations';

import { AppComponent }                   from './app/app.component';
import { routes }                         from './app/app.routes';
import { KeycloakService }                from './app/core/keycloak.service';
import { AuthInterceptor }                from './app/core/auth.interceptor';

export function initializeKeycloak(kc: KeycloakService) {
  // Devolvemos siempre una Promise que resuelve a true,
  // capturando el 401 de check-sso para no bloquear el bootstrap.
  return () => kc.init()
    .then(() => true)
    .catch(err => {
      console.warn('Keycloak SSO check falló, seguimos sin sesión:', err);
      return true;
    });
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideAnimations(),

    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [KeycloakService],
      multi: true
    }
  ]
}).catch(err => console.error('Bootstrap error:', err));
