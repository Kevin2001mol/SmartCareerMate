import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { LayoutService } from '../../core/layout.service';

@Component({
  selector: 'app-sidebar',
  template: `
    <aside
      class="bg-gray-100 border-r p-4 fixed top-16 bottom-0 left-0 w-64 transform transition-transform z-20"
      [class.translate-x-0]="!(layout.collapsed$ | async)"
      [class.-translate-x-full]="layout.collapsed$ | async"
    >
      <nav class="space-y-2">
        <a routerLink="/home" class="block px-4 py-2 rounded hover:bg-gray-200">
          Home
        </a>
        <a
          class="block px-4 py-2 rounded hover:bg-gray-200"
          (click)="goToInterview()"
        >
          Chat AI
        </a>
      </nav>
    </aside>
  `,
})
export class SidebarComponent {
  constructor(
    public layout: LayoutService,
    private router: Router,
    private vps: ViewportScroller
  ) {}

  goToInterview() {
    const anchor = 'interview-section';
    if (this.router.url !== '/home') {
      this.router.navigate(['/home']).then(() => {
        setTimeout(() => this.vps.scrollToAnchor(anchor), 50);
      });
    } else {
      this.vps.scrollToAnchor(anchor);
    }
  }
}
