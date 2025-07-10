import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutService } from '../../core/layout.service';
import { KeycloakService } from '../../core/keycloak.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <mat-toolbar
      class="fixed top-0 left-0 right-0 z-30 bg-blue-600 text-white h-16 flex justify-between items-center px-4"
    >
      <div class="flex items-center">
        <button mat-icon-button (click)="layout.toggle()">
          <mat-icon>menu</mat-icon>
        </button>

        <!-- Usamos un anchor con routerLink -->
        <a
          mat-button
          routerLink="/home"
          disableRipple
          class="ml-2 text-lg font-bold select-none"
          style="text-transform: none; color: white; cursor: pointer;"
        >
          Smart Career Mate
        </a>
      </div>

      <div class="flex items-center space-x-4">
        <button *ngIf="!kc.isLoggedIn()" mat-button (click)="kc.login()">
          Login
        </button>
        <button *ngIf="kc.isLoggedIn()" mat-button routerLink="/profile">
          Mi Perfil
        </button>
        <button *ngIf="kc.isLoggedIn()" mat-button (click)="kc.logout()">
          Logout
        </button>
      </div>
    </mat-toolbar>
  `,
})
export class HeaderComponent {
  constructor(public layout: LayoutService, public kc: KeycloakService) {}
}
