// src/app/core/keycloak.service.ts
import { Injectable } from '@angular/core';
import Keycloak, { KeycloakInstance } from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private kc!: KeycloakInstance;

  /**
   * Inicializa el adaptador Keycloak y comprueba sesión (check-sso).
   * Debe llamarse antes de arrancar la app.
   */
  init(): Promise<boolean> {
    this.kc = new Keycloak({
      url: 'http://localhost:8081',      // ← Apuntamos a la raíz de Keycloak
      realm: 'SmartCareerMate',
      clientId: 'smart-career-frontend'
    });
    return this.kc.init({
      onLoad: 'check-sso',     // comprueba sesión sin forzar login
      checkLoginIframe: false  // desactiva el iframe que daba timeout
    });
  }

  /** Lanza el flujo de login de Keycloak */
  login(): void {
    this.kc.login();
  }

  /** Cierra la sesión y redirige a la home */
  logout(): void {
    this.kc.logout({ redirectUri: window.location.origin });
  }

  /** Indica si hay un token válido */
  isLoggedIn(): boolean {
    return !!this.kc.token;
  }

  /** Devuelve el token JWT actual */
  getToken(): string {
    return this.kc.token!;
  }

  /** Nombre de usuario (campo preferred_username del token) */
  getUsername(): string {
    return (this.kc.tokenParsed as Record<string, any>)?.['preferred_username'] as string;
  }
}
