import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  NgZone,
} from '@angular/core';

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
import { take } from 'rxjs/operators';

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
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild('cvResult') cvResult?: ElementRef<HTMLElement>;
  @ViewChild('letterResult') letterResult?: ElementRef<HTMLElement>;
  @ViewChild('chatWindow') chatWindow?: ElementRef<HTMLElement>;

  /* =============== Estado general =============== */
  cvName = '';
  parsedCv = '';
  offerText = '';
  generatedCvText = '';
  generatedLetter = '';
  uploadStatus = '';
  cvList: any[] = [];
  isLoading = false;
  generatingCv = false;
  generatingLetter = false;

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
    private vps: ViewportScroller,
    private zone: NgZone
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
    } catch (err) {
      console.error('Error al parsear CV:', err);
      this.uploadStatus = '❌ Error al procesar el CV';
    } finally {
      this.isLoading = false;
    }
  }

  async generateCv() {
    if (!this.parsedCv || !this.offerText) return;
    this.generatingCv = true;

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
      this.zone.onStable.pipe(take(1)).subscribe(() => {
        this.cvResult?.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    } catch (err) {
      console.error('Error AI rewrite:', err);
    } finally {
      this.generatingCv = false;
    }
  }

  /** Generar carta de presentación */
  async generateLetter() {
    if (!this.parsedCv || !this.offerText) return;
    this.generatingLetter = true;

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
      this.zone.onStable.pipe(take(1)).subscribe(() => {
        this.letterResult?.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    } catch (err) {
      console.error('Error AI cover-letter:', err);
    } finally {
      this.generatingLetter = false;
    }
  }

  /* ========== Entrevista ========== */
  interviewLoading = false;
  interviewPendingIndex: number | null = null;
  async startInterview() {
    // 🔥 Resetea estado
    this.chat = [];
    this.history = [];
    this.lastFeedback = '';
    this.lastScore = null;
    this.interviewActive = true;

    // Inserta placeholder inicial
    this.interviewLoading = true;
    this.interviewPendingIndex = this.chat.length; // será 0
    this.chat.push({
      from: 'bot',
      text: '⏳ Un momento, el reclutador está de camino, vaya tomando asiento…',
    });

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

      // Reemplaza el placeholder con la pregunta real
      this.chat[this.interviewPendingIndex!] = {
        from: 'bot',
        text: first.question,
      };
      this.interviewPendingIndex = null;

      // Guarda feedback (si hubiera) y ajusta currentQuestion
      this.pushFeedback(first);
    } catch (err) {
      console.error('Error al iniciar entrevista:', err);
      // Sustituye el placeholder por un mensaje de error
      this.chat[this.interviewPendingIndex ?? this.chat.length - 1] = {
        from: 'bot',
        text: '⚠️ Error al iniciar la entrevista, inténtalo de nuevo.',
      };
      this.interviewPendingIndex = null;
      this.interviewActive = false;
    } finally {
      this.interviewLoading = false;
      this.scrollChatToBottom();
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
      this.scrollChatToBottom();
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
    this.scrollChatToBottom();
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

  /* ========== Chat – auto-scroll ========== */

  private scrollChatToBottom() {
    /* espera al siguiente ciclo para que Angular pinte el último mensaje */
    setTimeout(() => {
      const box = this.chatWindow?.nativeElement;
      if (box) {
        box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
      }
    }, 0);
  }
  /** Desplaza la ventana cuando Angular ha terminado de pintar */
  private scrollResult(ref?: ElementRef<HTMLElement>) {
    if (!ref) {
      return;
    } // aún no existe
    this.zone.onStable.pipe(take(1)).subscribe(() => {
      ref.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}
