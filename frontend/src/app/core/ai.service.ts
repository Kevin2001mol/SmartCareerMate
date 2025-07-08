// src/app/core/ai.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RewritePayload {
  cvText: string;
  offerText: string;
  language: string;
  tone: string;
  temperature: number;
}

export interface AiResponse {
  text: string;
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly baseUrl = '/ai'; // pasa por el gateway

  constructor(private http: HttpClient) {}

  rewrite(body: RewritePayload): Observable<AiResponse> {
    return this.http.post<AiResponse>(`${this.baseUrl}/rewrite`, body);
  }

  coverLetter(body: RewritePayload): Observable<AiResponse> {
    return this.http.post<AiResponse>(`${this.baseUrl}/cover-letter`, body);
  }
}
