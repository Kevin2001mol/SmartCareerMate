import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  /** Controla apertura/cierre si lo necesitas dinámico */
  @Input() collapsed = false;
}
