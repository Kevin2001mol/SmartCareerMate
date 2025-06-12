import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      // Home (cargado de forma directa)
      { path: 'home', component: HomeComponent },

      // Cuando crees ChatComponent, descomenta esto:
       {
         path: 'chat',
         loadComponent: () =>
           import('./pages/chat/chat.component').then(m => m.ChatComponent)
       },

      // Redirección raíz → /home
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];
