import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CvService {
  private readonly base = '/api/cv'; // ← el prefijo que el gateway re-envía

  constructor(private http: HttpClient) {}

  upload(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<string>('/api/cv/parse', fd, {
      responseType: 'text' as any, // ← recibimos texto plano
    });
  }
}
