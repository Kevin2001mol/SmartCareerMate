// src/app/layout/sidebar/sidebar.component.ts
import { Component, Input }  from '@angular/core';
import { RouterModule }      from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <aside
      class="bg-gray-100 border-r p-4 fixed inset-y-0 left-0 w-64 transform transition-transform lg:relative lg:translate-x-0"
      [class.-translate-x-full]="collapsed"
    >
      <nav class="space-y-2">
        <a routerLink="/home"    class="block px-4 py-2 rounded hover:bg-gray-200">Home</a>
        <a routerLink="/login"   class="block px-4 py-2 rounded hover:bg-gray-200">Login</a>
        <a routerLink="/profile" class="block px-4 py-2 rounded hover:bg-gray-200">Mi Perfil</a>
      </nav>
    </aside>
  `
})
export class SidebarComponent {
  @Input() collapsed = false;
}
