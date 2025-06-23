// src/app/app.component.ts
import { Component }            from '@angular/core';
import { NgIf }                 from '@angular/common';
import { RouterModule }         from '@angular/router';
import { MatToolbarModule }     from '@angular/material/toolbar';
import { MatSidenavModule }     from '@angular/material/sidenav';
import { MatButtonModule }      from '@angular/material/button';
import { MatIconModule }        from '@angular/material/icon';
import { MatListModule }        from '@angular/material/list';
import { KeycloakService }      from './core/keycloak.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule
  ],
  template: `
    <mat-toolbar color="primary" class="px-4 flex justify-between">
      <button mat-icon-button (click)="opened = !opened">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="text-lg font-bold">Smart Career Mate</span>
      <div class="flex items-center space-x-4">
        <button mat-button routerLink="/home" *ngIf="!kc.isLoggedIn()">Home</button>
        <button mat-button (click)="kc.login()" *ngIf="!kc.isLoggedIn()">Iniciar sesión</button>
        <button mat-button routerLink="/profile" *ngIf="kc.isLoggedIn()">Mi Perfil</button>
        <button mat-icon-button (click)="kc.logout()" *ngIf="kc.isLoggedIn()">
          <mat-icon>logout</mat-icon>
        </button>
      </div>
    </mat-toolbar>

    <mat-sidenav-container class="h-[calc(100vh-64px)]">
      <mat-sidenav [(opened)]="opened" mode="side">
        <mat-nav-list>
          <a mat-list-item routerLink="/home">Home</a>
          <a mat-list-item routerLink="/chat">Chat AI</a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <main class="p-4">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class AppComponent {
  opened = false;
  constructor(public kc: KeycloakService) {}
}
