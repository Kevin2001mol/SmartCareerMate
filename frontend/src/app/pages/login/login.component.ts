// src/app/pages/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { KeycloakService }   from '../../core/keycloak.service';

@Component({
  selector: 'app-login',
  template: `
    <h2>Iniciar Sesión</h2>
    <p>Redirigiendo a Keycloak…</p>
  `
})
export class LoginComponent implements OnInit {
  constructor(private kc: KeycloakService) {}

  ngOnInit() {
    this.kc.login();
  }
}
