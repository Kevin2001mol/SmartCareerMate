import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private top$       = new Subject<void>();
  private interview$ = new Subject<void>();

  onTop$       = this.top$.asObservable();
  onInterview$ = this.interview$.asObservable();

  goTop()       { this.top$.next(); }
  goInterview() { this.interview$.next(); }
}
