// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter }        from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations }    from '@angular/platform-browser/animations';

import { AppComponent }   from './app/app.component';
import { routes }         from './app/app.routes';
import { AuthInterceptor } from './app/core/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    // 1) Routing
    provideRouter(routes),

    // 2) HttpClient
    provideHttpClient(),

    // 3) Nuestro interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    // 4) Animaciones para Angular Material
    provideAnimations()
  ]
})
.catch(err => console.error(err));
