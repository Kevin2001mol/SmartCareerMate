import { Component, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  isLoggedIn$: Observable<boolean>;

  constructor(private auth: AuthService) {
    this.isLoggedIn$ = this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout();
  }
}
