import { Component, Output, EventEmitter } from '@angular/core';

// Importamos los módulos que necesitamos
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule }    from '@angular/material/icon';
import { MatButtonModule }  from '@angular/material/button';
import { RouterModule }     from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule,  // para <mat-toolbar>
    MatIconModule,     // para <mat-icon>
    MatButtonModule,   // para mat-button
    RouterModule       // para routerLink (si lo usas)
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
}
