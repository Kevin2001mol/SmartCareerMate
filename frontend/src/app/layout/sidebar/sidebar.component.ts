import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgClass, AsyncPipe } from '@angular/common';
import { LayoutService } from '../../core/layout.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, NgClass, AsyncPipe],
  template: `
    <aside
      class="bg-gray-100 border-r p-4 fixed top-16 bottom-0 left-0 w-64 transform transition-transform z-20"
      [class.translate-x-0]="!(layout.collapsed$ | async)"
      [class.-translate-x-full]="layout.collapsed$ | async"
    >
      <nav class="space-y-2">
        <a routerLink="/home"  class="block px-4 py-2 rounded hover:bg-gray-200">Home</a>
        <a routerLink="/chat"  class="block px-4 py-2 rounded hover:bg-gray-200">Chat AI</a>
      </nav>
    </aside>
  `
})
export class SidebarComponent {
  constructor(public layout: LayoutService) {}
}
