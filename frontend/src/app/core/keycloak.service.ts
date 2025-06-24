// src/app/core/keycloak.service.ts
import { Injectable } from '@angular/core';
import Keycloak, { KeycloakInstance } from 'keycloak-js';
import { BehaviorSubject, of, from } from 'rxjs';
import { switchMap, map, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private kc!: KeycloakInstance;

  /* Stream “ya ha iniciado sesión”  --------------------------- */
  private readonly _loggedIn = new BehaviorSubject<boolean>(false);
  readonly loggedIn$ = this._loggedIn.asObservable();

  /* Stream con nombre + email -------------------------------- */
  readonly profile$ = this.loggedIn$.pipe(
    switchMap((logged) => {
      if (!logged) {
        return of(null);
      }

      /* Opción 1 – del token */
      const t = this.kc.tokenParsed as any;
      const name = t?.name ?? t?.preferred_username ?? '';
      const email = t?.email ?? '';
      return of({ name, email });
    }),
    shareReplay(1)
  );

  init(): Promise<boolean> {
    this.kc = new Keycloak({
      url: 'http://localhost:8180',
      realm: 'SmartCareerMate',
      clientId: 'smart-career-frontend',
    });

    return this.kc
      .init({
        onLoad: 'check-sso',
        checkLoginIframe: true,
        silentCheckSsoRedirectUri: `${window.location.origin}/assets/silent-check-sso.html`,
        redirectUri: `${window.location.origin}/home`,
        pkceMethod: 'S256',
      })
      .then(() => {
        this._loggedIn.next(!!this.kc.token);
        this.kc.onAuthSuccess = () => this._loggedIn.next(true);
        this.kc.onAuthLogout = () => this._loggedIn.next(false);
        this.kc.onTokenExpired = () => this.kc.updateToken(20);
        return true;
      });
  }

  login() {
    this.kc.login({ redirectUri: `${window.location.origin}/home` });
  }
  logout() {
    this.kc.logout({ redirectUri: `${window.location.origin}/home` });
  }

  getToken() {
    return this.kc.token ?? '';
  }
  getUsername() {
    return (this.kc.tokenParsed as any)?.preferred_username ?? '';
  }
  editProfile() {
    this.kc.accountManagement();
  }
}
