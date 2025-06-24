import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient
} from '@angular/common/http';
import {
  provideAnimationsAsync,   
} from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // ► HTTP Client sin el interceptor de autenticación
    provideHttpClient(),

    // ► Rutas de la aplicación
    provideRouter(routes),

    // ► Animaciones Angular Material (opcional)
    provideAnimationsAsync(),
  ],
};
