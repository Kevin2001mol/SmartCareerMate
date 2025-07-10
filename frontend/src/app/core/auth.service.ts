import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserProfile {
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Observable para saber si estamos logueados
  private loggedIn$ = new BehaviorSubject<boolean>(false);
  // Aquí guardaremos el perfil simulado
  private userProfile: UserProfile | null = null;

  /** Para que componentes se suscriban al estado de login */
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  /** Simula un login (en producción hace HTTP) */
  login(credentials: { email: string; password: string }) {
    // TODO: aquí llamada real al backend y manejo de token
    this.userProfile = { name: 'Usuario de prueba', email: credentials.email };
    this.loggedIn$.next(true);
  }

  /** Simula un registro (en producción hace HTTP) */
  register(data: { name: string; email: string; password: string }) {
    // TODO: aquí llamada real al backend de registro
    this.userProfile = { name: data.name, email: data.email };
    this.loggedIn$.next(true);
  }

  /** Cierra sesión */
  logout() {
    this.userProfile = null;
    this.loggedIn$.next(false);
  }

  /** Devuelve el perfil actual (o null) */
  getProfile(): UserProfile | null {
    return this.userProfile;
  }
}
