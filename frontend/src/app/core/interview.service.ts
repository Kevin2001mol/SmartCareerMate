// src/app/core/interview.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/* ---------- DTOs igual que en Java ---------- */
export interface QA { question: string; answer: string; }
export type Level = 'principiante' | 'medio' | 'avanzado';

export interface InterviewTurn {
  cvJson:   string;
  offerText: string;
  history:   QA[];
  level:     Level;
}


export interface InterviewResponse {
  question: string;
  feedback: string;
  score: number;
}

@Injectable({ providedIn: 'root' })
export class InterviewService {
  private http = inject(HttpClient);

  turn(body: InterviewTurn): Observable<InterviewResponse> {
    //  → /ai/interview pasa por el proxy.conf.json y por el Gateway
    return this.http.post<InterviewResponse>('/ai/interview', body);
  }
}
