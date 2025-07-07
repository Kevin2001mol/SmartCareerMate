import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CvService {
  private readonly baseUrl = '/api/cv';

  constructor(private http: HttpClient) {}

  // Subir y parsear CV
  upload(file: File, userId: number = 1): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    const params = new HttpParams().set('userId', userId.toString());
    
    return this.http.post<string>(`${this.baseUrl}/parse`, formData, {
      params,
      responseType: 'text' as any
    });
  }

  // Obtener CVs de un usuario
  getCvsByUser(userId: number): Observable<any[]> {
    const params = new HttpParams().set('user', userId.toString());
    return this.http.get<any[]>(this.baseUrl, { params });
  }

  // Obtener un CV específico
  getCvById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}