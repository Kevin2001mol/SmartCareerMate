// src/app/core/keycloak.service.ts
import { Injectable } from '@angular/core';
import Keycloak, { KeycloakInstance } from 'keycloak-js';
import { BehaviorSubject, of } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private kc!: KeycloakInstance;

  /* Stream “ya ha iniciado sesión” --------------------------- */
  private readonly _loggedIn = new BehaviorSubject<boolean>(false);
  readonly loggedIn$ = this._loggedIn.asObservable();

  /* Stream con nombre + email -------------------------------- */
  readonly profile$ = this.loggedIn$.pipe(
    switchMap((logged) => {
      if (!logged) {
        return of(null);
      }
      const t = this.kc.tokenParsed as any;
      return of({
        name: t?.name ?? t?.preferred_username ?? '',
        email: t?.email ?? '',
      });
    }),
    shareReplay(1)
  );

  /* ---------------------------------------------------------- */
  init(): Promise<boolean> {
    /* ②  —>  parámetros del environment */
    this.kc = new Keycloak({
      url: environment.keycloak.url,
      realm: environment.keycloak.realm,
      clientId: environment.keycloak.clientId,
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

  /* helpers -------------------------------------------------- */
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
