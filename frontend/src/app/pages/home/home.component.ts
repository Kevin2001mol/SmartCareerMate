// src/app/pages/home/home.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, NgClass } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
interface ChatMsg {
  from: 'user' | 'bot';
  text: string;
}

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    NgIf,
    NgFor,
    NgClass,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="container mx-auto max-w-7xl p-4 space-y-6">
      <!-- 1. Cargar CV ------------------------------------------------------ -->
      <mat-card appearance="outlined" class="p-4">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <mat-icon>upload</mat-icon> Cargar CV
        </h2>
        <label
          class="border-2 border-dashed rounded-md w-full h-40 flex
                     flex-col justify-center items-center text-slate-500
                     hover:bg-slate-50 cursor-pointer"
        >
          <input type="file" accept=".pdf" hidden (change)="onCv($event)" />
          <mat-icon class="text-4xl">cloud_upload</mat-icon>
          <span class="mt-2">Arrastra o haz clic para subir PDF</span>
        </label>
        <p *ngIf="cvName" class="mt-2 text-sm text-emerald-600">
          <mat-icon class="text-base">check_circle</mat-icon> {{ cvName }}
        </p>
      </mat-card>

      <!-- 2. Oferta + Ajustes ---------------------------------------------- -->
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Oferta -->
        <mat-card appearance="outlined" class="flex-1 p-4">
          <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
            <mat-icon>work</mat-icon> Información de la oferta
          </h2>
          <textarea
            matInput
            rows="10"
            [(ngModel)]="offerText"
            placeholder="Pega aquí la descripción o enlace…"
            class="w-full resize-y border rounded p-2"
          ></textarea>
        </mat-card>

        <!-- Config -->
        <mat-card
          appearance="outlined"
          class="w-full md:w-72 shrink-0 p-4 space-y-4"
        >
          <h2 class="text-lg font-semibold flex items-center gap-2">
            <mat-icon>translate</mat-icon> Configuración
          </h2>

          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Idioma</mat-label>
            <mat-select [(ngModel)]="lang">
              <mat-option value="es">Español</mat-option>
              <mat-option value="en">Inglés</mat-option>
              <mat-option value="fr">Francés</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="fill" class="w-full">
            <mat-label>Tono</mat-label>
            <mat-select [(ngModel)]="tone">
              <mat-option value="formal">Formal</mat-option>
              <mat-option value="profesional">Profesional</mat-option>
              <mat-option value="cercano">Cercano</mat-option>
            </mat-select>
          </mat-form-field>
        </mat-card>
      </div>

      <!-- 3. Botones de generación ----------------------------------------- -->
      <mat-card appearance="outlined" class="p-4 flex flex-wrap gap-4">
        <button
          mat-raised-button
          color="primary"
          (click)="generateCv()"
          [disabled]="!cvName"
        >
          <mat-icon>description</mat-icon> Generar CV adaptado
        </button>

        <button
          mat-raised-button
          color="accent"
          (click)="generateLetter()"
          [disabled]="!offerText"
        >
          <mat-icon>drafts</mat-icon> Generar carta de Presentación
        </button>
      </mat-card>

      <!-- 3-b Resultados ---------------------------------------------------- -->
      <ng-container *ngIf="generatedCv || generatedLetter">
        <mat-card appearance="outlined" *ngIf="generatedCv" class="p-4">
          <h3 class="font-semibold mb-2 flex items-center gap-2">
            <mat-icon>download</mat-icon> CV generado
          </h3>
          <a [href]="generatedCv" download class="text-primary-600 underline">
            Descargar CV
          </a>
        </mat-card>

        <mat-card
          appearance="outlined"
          *ngIf="generatedLetter"
          class="p-4 space-y-2"
        >
          <h3 class="font-semibold flex items-center gap-2">
            <mat-icon>article</mat-icon> Carta generada
          </h3>
          <textarea readonly rows="10" class="w-full border rounded p-2">{{
            generatedLetter
          }}</textarea>
        </mat-card>
      </ng-container>

      <!-- 4. Chat entrevista ----------------------------------------------- -->
      <mat-card appearance="outlined" class="p-4 space-y-4">
        <div class="flex items-center gap-4 flex-wrap">
          <h2 class="text-xl font-semibold flex items-center gap-2 m-0">
            <mat-icon>chat</mat-icon> Entrevista simulada
          </h2>

          <mat-form-field appearance="fill" class="w-40">
            <mat-label>Nivel</mat-label>
            <mat-select [(ngModel)]="level">
              <mat-option value="principiante">Principiante</mat-option>
              <mat-option value="medio">Medio</mat-option>
              <mat-option value="avanzado">Avanzado</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- ventana chat -->
        <div
          class="border rounded h-64 overflow-y-auto p-2 space-y-2 bg-slate-50"
        >
          <div
            *ngFor="let m of chat"
            [ngClass]="{
              'text-right': m.from === 'user',
              'text-left': m.from === 'bot'
            }"
          >
            <span
              class="inline-block px-3 py-1 rounded-lg"
              [ngClass]="
                m.from === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border'
              "
            >
              {{ m.text }}
            </span>
          </div>
        </div>

        <form (submit)="sendMsg()" class="flex gap-2">
          <input
            matInput
            placeholder="Escribe tu respuesta…"
            [(ngModel)]="chatInput"
            name="msg"
            class="flex-1 border rounded p-2"
          />
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="!chatInput.trim()"
          >
            Enviar
          </button>
        </form>
      </mat-card>
    </div>
  `,
})
export class HomeComponent {
  /* -------------------------- estado demo ----------------------------- */
  cvName = '';
  offerText = '';
  lang = 'es';
  tone = 'profesional';
  generatedCv = ''; // URL o blob
  generatedLetter = ''; // string
  /* chat */
  level = 'principiante';
  chat: ChatMsg[] = [];
  chatInput = '';

  /* -------------------- handlers “mock” ------------------------------- */
  onCv(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    this.cvName = f?.name ?? '';
  }

  generateCv() {
    // TODO: llamada real → this.generatedCv = url...
    this.generatedCv = 'https://example.com/cv-result.pdf';
  }

  generateLetter() {
    // TODO: llamada real → this.generatedLetter = res.text ...
    this.generatedLetter = `Estimado equipo:

Adjunto mi CV adaptado a la vacante... [demo]

Un saludo.`;
  }

  sendMsg() {
    if (!this.chatInput.trim()) return;
    this.chat.push({ from: 'user', text: this.chatInput });
    // respuesta simulada
    this.chat.push({
      from: 'bot',
      text: `[AI nivel ${this.level}] …respuesta demo…`,
    });
    this.chatInput = '';
  }
}
