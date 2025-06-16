import { Component }        from '@angular/core';
import { HeaderComponent }  from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { RouterModule }     from '@angular/router';
import { NgIf }             from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgIf,               // si usas algún *ngIf aquí
    HeaderComponent,
    SidebarComponent,
    RouterModule        // para <router-outlet>
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sidebarCollapsed = false;
}
