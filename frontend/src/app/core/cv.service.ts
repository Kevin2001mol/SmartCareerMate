import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CvService {
  private readonly baseUrl = '/api/cv';

  constructor(private http: HttpClient) {}

  //Subir el CV
  upload(file: File, userId = 1) {
    const form = new FormData();
    form.append('file', file); // ⬅ nombre exacto del @RequestPart

    const params = new HttpParams().set('userId', String(userId)); // ⬅ nombre exacto del @RequestParam

    return this.http.post(
      '/api/cv/parse', // gateway lo reenvía al parser
      form,
      { params, responseType: 'text' } // el parser devuelve texto plano
    ) as Observable<string>;
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
