import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// 🔹 Angular Material
import { MatButtonModule } from '@angular/material/button';

// 🔹 Directivas / pipes de Angular common
import { NgIf, JsonPipe, AsyncPipe } from '@angular/common';   // <─ aquí

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    // Angular Material
    MatButtonModule,

    // Angular common  (para *ngIf y |json)
    NgIf,
    JsonPipe,
    // (AsyncPipe solo si usas |async más tarde)
  ],
})
export class HomeComponent {
  pingResponse?: unknown;

  constructor(private http: HttpClient) {}

  ping() {
    this.http.get('/api/ai/ping').subscribe({
      next: res => (this.pingResponse = res),
      error: err => console.error(err),
    });
  }
}
