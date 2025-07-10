import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import {
  ViewportScroller,
  NgIf,
  NgFor,
  NgClass,
  DatePipe,
  DecimalPipe,
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, firstValueFrom } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CvService } from '../../core/cv.service';
import { AiService, RewritePayload } from '../../core/ai.service';
import {
  InterviewService,
  QA,
  InterviewResponse,
  Level,
  Tone,
  Language,
} from '../../core/interview.service';
import { ScrollService } from '../../core/scroll.service';

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
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgClass,
    DatePipe,
    DecimalPipe,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div id="top" class="container mx-auto max-w-7xl p-4 space-y-6">
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

      <!-- Sección de debugging -->
      <mat-card appearance="outlined" class="p-4">
        <h2 class="text-xl font-semibold mb-4 flex items-center gap-2">
          <mat-icon>bug_report</mat-icon> Estado del sistema
        </h2>

        <div class="space-y-2">
          <button mat-raised-button (click)="testConnection()" color="accent">
            <mat-icon>wifi</mat-icon> Test conexión backend
          </button>

          <button mat-raised-button (click)="loadCvList()" color="primary">
            <mat-icon>refresh</mat-icon> Cargar lista de CVs
          </button>

          <p
            *ngIf="uploadStatus"
            [class]="
              uploadStatus.includes('✅') ? 'text-green-600' : 'text-red-600'
            "
          >
            Estado: {{ uploadStatus }}
          </p>

          <div *ngIf="isLoading" class="flex items-center gap-2">
            <mat-icon class="animate-spin">refresh</mat-icon>
            <span>Procesando...</span>
          </div>
        </div>
      </mat-card>

      <!-- Lista de CVs almacenados -->
      <mat-card appearance="outlined" class="p-4" *ngIf="cvList.length > 0">
        <h3 class="font-semibold mb-2 flex items-center gap-2">
          <mat-icon>list</mat-icon> CVs almacenados ({{ cvList.length }})
        </h3>
        <div class="space-y-2">
          <div *ngFor="let cv of cvList" class="border rounded p-2">
            <strong>{{ cv.originalName }}</strong>
            <small class="text-gray-500"
              >(ID: {{ cv.id }}, subido:
              {{ cv.createdAt | date : 'short' }})</small
            >
            <p class="text-sm mt-1">{{ cv.rawText.substring(0, 100) }}...</p>
          </div>
        </div>
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
            <mat-select [(ngModel)]="language">
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
      <ng-container *ngIf="generatedCvText || generatedLetter">
        <mat-card
          appearance="outlined"
          *ngIf="generatedCvText"
          class="p-4 space-y-2"
        >
          <h3 class="font-semibold flex items-center gap-2">
            <mat-icon>article</mat-icon> CV adaptado
          </h3>
          <textarea readonly rows="12" class="w-full border rounded p-2">
        {{ generatedCvText }}</textarea
          >
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
      <mat-card
        id="interview-section"
        appearance="outlined"
        class="p-4 space-y-4"
      >
        <!-- cabecera: título, nivel y botones -->
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

          <button
            mat-stroked-button
            color="primary"
            (click)="startInterview()"
            [disabled]="interviewActive || !parsedCv || !offerText"
          >
            <mat-icon>play_arrow</mat-icon> Iniciar entrevista
          </button>

          <button
            mat-stroked-button
            color="warn"
            (click)="endInterview()"
            [disabled]="!interviewActive"
          >
            <mat-icon>stop</mat-icon> Terminar
          </button>
        </div>
        <!-- ← único cierre del div de cabecera -->

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
                m.from === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'
              "
            >
              {{ m.text }}
            </span>
          </div>
        </div>

        <!-- input -->
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

        <!-- feedback -->
        <div *ngIf="lastFeedback" class="text-sm text-gray-500">
          <mat-icon inline>info</mat-icon>
          <strong>Feedback:</strong> {{ lastFeedback }}
          <span *ngIf="lastScore !== null">
            – Puntuación: {{ lastScore | number : '1.0-2' }}
          </span>
        </div>
      </mat-card>
      <!-- ← cierre del mat-card -->
    </div>
  `,
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();

  /* =============== Estado general =============== */
  cvName = '';
  parsedCv = '';
  offerText = '';
  generatedCvText = '';
  generatedLetter = '';
  uploadStatus = '';
  cvList: any[] = [];
  isLoading = false;

  /* =============== Entrevista =============== */
  interviewActive = false;
  chat: ChatMsg[] = [];
  chatInput = '';
  history: QA[] = [];
  currentQuestion = '';
  lastFeedback = '';
  lastScore: number | null = null;
  level: Level = 'principiante';
  language: Language = 'es';
  tone: Tone = 'profesional';

  constructor(
    private cvService: CvService,
    private ai: AiService,
    private interview: InterviewService,
    private scroll: ScrollService,
    private vps: ViewportScroller
  ) {}

  ngAfterViewInit() {
    this.scroll.onTop$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const topEl = document.getElementById('top');
      topEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    this.scroll.onInterview$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      const interviewEl = document.getElementById('interview-section');
      interviewEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /** 1️⃣ Subir y parsear CV - MEJORADO */
  async onCv(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    this.cvName = file.name;
    this.isLoading = true;
    this.uploadStatus = 'Subiendo archivo...';

    try {
      // Pasar userId (hardcodeado por ahora)
      const text = await firstValueFrom(this.cvService.upload(file, 1));
      this.parsedCv = text;
      this.uploadStatus = '✅ CV parseado exitosamente';

      // Esperar un poco y luego cargar la lista de CVs
      setTimeout(() => this.loadCvList(), 2000);
    } catch (err) {
      console.error('Error al parsear CV:', err);
      this.uploadStatus = '❌ Error al procesar el CV';
    } finally {
      this.isLoading = false;
    }
  }

  /** Cargar lista de CVs del usuario */
  async loadCvList() {
    try {
      this.cvList = await firstValueFrom(this.cvService.getCvsByUser(1));
      console.log('CVs encontrados:', this.cvList);
    } catch (err) {
      console.error('Error al cargar CVs:', err);
    }
  }

  /** Método para testear la conexión */
  async testConnection() {
    try {
      const response = await fetch('/api/cv/1');
      if (response.ok) {
        console.log('✅ Conexión al backend OK');
        this.uploadStatus = '✅ Backend conectado';
      } else {
        console.log('❌ Backend responde con error:', response.status);
        this.uploadStatus = `❌ Backend error: ${response.status}`;
      }
    } catch (err) {
      console.log('❌ No se puede conectar al backend:', err);
      this.uploadStatus = '❌ Backend no disponible';
    }
  }

  async generateCv() {
    if (!this.parsedCv || !this.offerText) return;
    this.isLoading = true;
    const payload: RewritePayload = {
      cvText: this.parsedCv,
      offerText: this.offerText,
      language: this.language,
      tone: this.tone,
      temperature: 0.2,
    };
    try {
      const res = await firstValueFrom(this.ai.rewrite(payload));
      this.generatedCvText = res.text;
    } catch (err) {
      console.error('Error AI rewrite:', err);
    } finally {
      this.isLoading = false;
    }
  }

  async generateLetter() {
    if (!this.parsedCv || !this.offerText) return;
    this.isLoading = true;
    const payload: RewritePayload = {
      cvText: this.parsedCv,
      offerText: this.offerText,
      language: this.language,
      tone: this.tone,
      temperature: 0.2,
    };
    try {
      const res = await firstValueFrom(this.ai.coverLetter(payload));
      this.generatedLetter = res.text;
    } catch (err) {
      console.error('Error AI cover-letter:', err);
    } finally {
      this.isLoading = false;
    }
  }
  /* ========== Entrevista ========== */
  async startInterview() {
    this.chat = [];
    this.history = [];
    this.lastFeedback = '';
    this.lastScore = null;
    this.interviewActive = true;

    try {
      const first = await firstValueFrom(
        this.interview.turn({
          cvJson: this.parsedCv,
          offerText: this.offerText,
          history: [],
          level: this.level,
          language: this.language,
          tone: this.tone,
        })
      );

      this.pushBot(first);
    } catch (err) {
      console.error('Error al iniciar entrevista:', err);
      this.interviewActive = false;
    }
  }
  /* ========== propiedades ========== */
  isWaiting = false;
  pendingIndex: number | null = null; // dónde está el placeholder

  /* ========== sendMsg() ========== */
  async sendMsg() {
    if (!this.chatInput.trim() || !this.interviewActive || this.isWaiting)
      return;

    const answer = this.chatInput.trim();
    this.chat.push({ from: 'user', text: answer });
    this.history.push({ question: this.currentQuestion, answer });
    this.chatInput = '';

    /* placeholder mientras esperamos al backend */
    this.isWaiting = true;
    this.pendingIndex = this.chat.length;
    this.chat.push({ from: 'bot', text: '💬 Pensando…' });

    try {
      const res = await firstValueFrom(
        this.interview.turn({
          cvJson: this.parsedCv,
          offerText: this.offerText,
          history: this.history,
          level: this.level,
          language: this.language,
          tone: this.tone,
        })
      );
      /* remplaza placeholder */
      this.chat[this.pendingIndex] = { from: 'bot', text: res.question };
      this.pendingIndex = null;
      this.pushFeedback(res);
    } catch (err) {
      this.chat[this.pendingIndex ?? this.chat.length - 1] = {
        from: 'bot',
        text: '⚠️ Hubo un problema, inténtalo de nuevo.',
      };
    } finally {
      this.isWaiting = false;
    }
  }

  /* feedback separado */
  private pushFeedback(res: InterviewResponse) {
    if (res.feedback) {
      this.chat.push({
        from: 'bot',
        text: `📝 Feedback: ${res.feedback} (score ${(res.score * 100).toFixed(
          0
        )} %)`,
      });
    }
    this.currentQuestion = res.question;
  }

  endInterview() {
    this.interviewActive = false;
    this.history = [];
    this.currentQuestion = '';
    this.lastFeedback = '';
    this.lastScore = null;
    this.chat.push({ from: 'bot', text: 'Entrevista finalizada. ¡Gracias!' });
    this.scrollChatToBottom();
  }

  /* ───────────────────────── helpers ───────────────────────── */

  private pushBot(res: InterviewResponse) {
    /* feedback del turno anterior */
    this.lastFeedback = res.feedback ?? '';
    this.lastScore = res.score;

    if (this.lastFeedback) {
      this.chat.push({
        from: 'bot',
        text: `📝 Feedback: ${this.lastFeedback} (score ${(
          this.lastScore * 100
        ).toFixed(0)} %)`,
      });
    }

    /* siguiente pregunta */
    this.currentQuestion = res.question;
    this.chat.push({ from: 'bot', text: res.question });
    this.scrollChatToBottom();
  }

  /** desplaza la ventana de chat al final */
  private scrollChatToBottom() {
    setTimeout(() => {
      const box = document.querySelector<HTMLElement>('.border.rounded.h-64');
      box?.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
    });
  }
}
