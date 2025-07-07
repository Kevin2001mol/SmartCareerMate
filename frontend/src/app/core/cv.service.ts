import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CvService {
  // 1) Rutas que terminan en el core-service
  private readonly coreBase = '/api/core/cv';

  // 2) Ruta que va al parser
  private readonly parserUrl = '/api/cv/parse';

  constructor(private http: HttpClient) {}

  /* ---------- subir y parsear ---------- */
  upload(file: File, userId = 1) {
    // <- SIN CAMBIOS
    const form = new FormData();
    form.append('file', file);

    const params = new HttpParams().set('userId', userId);
    return this.http.post(this.parserUrl, form, {
      params,
      responseType: 'text',
    }) as Observable<string>;
  }

  /* ---------- listar CVs de un usuario ---------- */
  getCvsByUser(userId: number) {
    const params = new HttpParams().set('user', userId);
    return this.http.get<any[]>(this.coreBase, { params });
  }

  /* ---------- obtener CV concreto ---------- */
  getCvById(id: number) {
    return this.http.get<any>(`${this.coreBase}/${id}`);
  }
}
