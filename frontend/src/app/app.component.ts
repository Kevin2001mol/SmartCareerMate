import { Component } from '@angular/core';
import { NgIf, AsyncPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { KeycloakService } from './core/keycloak.service';
import { ScrollService } from './core/scroll.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
  ],
  template: `
    <!-- BARRA SUPERIOR -->
    <mat-toolbar color="primary" class="px-4">
      <button mat-icon-button (click)="opened = !opened">
        <mat-icon>menu</mat-icon>
      </button>

      <!-- Ahora llama a openHome() -->
      <button
        mat-button
        disableRipple
        class="text-lg font-bold flex-1 pl-2"
        (click)="openHome()"
      >
        Smart Career Mate
      </button>

      <!-- Botones de sesión -->
      <ng-container *ngIf="!(kc.loggedIn$ | async)">
        <button mat-button (click)="kc.login()">Iniciar sesión</button>
      </ng-container>
      <ng-container *ngIf="kc.loggedIn$ | async">
        <button mat-button routerLink="/profile">Mi perfil</button>
        <button mat-icon-button (click)="kc.logout()">
          <mat-icon>logout</mat-icon>
        </button>
      </ng-container>
    </mat-toolbar>

    <!-- SIDENAV + CONTENIDO -->
    <mat-sidenav-container class="h-[calc(100vh-64px)]">
      <mat-sidenav [(opened)]="opened" mode="side">
        <mat-nav-list>
          <!-- Igual aquí -->
          <a mat-list-item (click)="openHome()">Home</a>
          <a mat-list-item (click)="openInterview()">Chat AI</a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <main class="p-4">
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export class AppComponent {
  opened = false;
  constructor(
    public kc: KeycloakService,
    public scroll: ScrollService,
    private router: Router
  ) {}

  openHome() {
    if (this.router.url.startsWith('/home')) {
      this.scroll.goTop();
    } else {
      this.router.navigate(['/home']).then(() => this.scroll.goTop());
    }
  }

  openInterview() {
    if (this.router.url.startsWith('/home')) {
      this.scroll.goInterview();
    } else {
      this.router.navigate(['/home']).then(() => this.scroll.goInterview());
    }
  }
}
