// src/app/pages/profile/profile.component.ts
import { Component } from '@angular/core';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatCardModule }   from '@angular/material/card';
import { MatIconModule }   from '@angular/material/icon';
import { MatDividerModule }from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { KeycloakService } from '../../core/keycloak.service';

@Component({
  selector   : 'app-profile',
  standalone : true,
  imports    : [
    NgIf, AsyncPipe,
    MatCardModule, MatIconModule, MatDividerModule, MatButtonModule
  ],
  template: `
    <!-- Si hay sesión --------------------------------------------------- -->
    <ng-container *ngIf="kc.loggedIn$ | async; else notLogged">

      <mat-card class="w-full max-w-lg mx-auto mt-10 shadow-xl rounded-2xl">

        <!-- Cabecera ---------------------------------------------------- -->
        <header class="flex items-center p-6 pb-0">
          <div
            class="flex items-center justify-center bg-indigo-600 text-white rounded-full w-16 h-16">
            <mat-icon fontIcon="account_circle" class="text-4xl"></mat-icon>
          </div>

          <div class="ml-4">
            <h2 class="text-2xl font-semibold leading-tight">
              Perfil de usuario
            </h2>
            <p class="text-sm text-slate-500">
              Información básica de tu cuenta
            </p>
          </div>
        </header>

        <mat-divider class="my-4"></mat-divider>

        <!-- Contenido --------------------------------------------------- -->
        <section *ngIf="kc.profile$ | async as p" class="px-6 pb-4 space-y-3">

          <div class="flex">
            <span class="w-24 font-medium text-slate-600">Nombre:</span>
            <span>{{ p.name || '—' }}</span>
          </div>

          <div class="flex">
            <span class="w-24 font-medium text-slate-600">Correo:</span>
            <span>{{ p.email || '—' }}</span>
          </div>
        </section>

        <mat-divider></mat-divider>

        <!-- Acciones ---------------------------------------------------- -->
        <footer class="p-4 pt-2 flex justify-end">
          <button mat-raised-button color="primary" (click)="kc.editProfile()">
            <mat-icon fontIcon="edit" class="mr-1 -ml-1"></mat-icon>
            Editar perfil
          </button>
        </footer>
      </mat-card>
    </ng-container>

    <!-- Cuando no hay sesión ------------------------------------------- -->
    <ng-template #notLogged>
      <p class="text-center mt-20 text-lg text-slate-500">
        Debes iniciar sesión para ver tu perfil.
      </p>
    </ng-template>
  `,
})
export class ProfileComponent {
  constructor(public kc: KeycloakService) {}
}
