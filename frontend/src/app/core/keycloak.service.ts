// src/app/core/keycloak.service.ts
import { Injectable } from '@angular/core';
import Keycloak, { KeycloakInstance } from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private kc!: KeycloakInstance;

  init(): Promise<boolean> {
    this.kc = new Keycloak({
      url: 'http://localhost:8180',
      realm: 'SmartCareerMate',
      clientId: 'smart-career-frontend',
    });
    return this.kc.init({
      onLoad: 'check-sso',
      checkLoginIframe: false,
      // Tras cargar sesión (o SSO), volvemos al /home
      redirectUri: `${window.location.origin}/home`,
    });
  }

  login(): void {
    this.kc.login({
      redirectUri: `${window.location.origin}/home`
    });
  }

  register(): void {
    this.kc.register({
      redirectUri: `${window.location.origin}/home`
    });
  }

  logout(): void {
    this.kc.logout({
      redirectUri: `${window.location.origin}/home`
    });
  }

  isLoggedIn(): boolean {
    return !!this.kc.token;
  }

  getToken(): string {
    return this.kc.token!;
  }

  getUsername(): string {
    return (this.kc.tokenParsed as Record<string, any>)?.['preferred_username'];
  }
}
