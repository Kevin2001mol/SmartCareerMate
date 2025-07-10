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
  templateUrl: './home.component.html',
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
