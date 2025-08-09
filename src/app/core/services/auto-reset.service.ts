import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './session.service';
import { TtsService } from './tts.service';

@Injectable({ providedIn: 'root' })
export class AutoResetService {
  private timer: any;
  private timeoutMs = 45000; // 45s demo

  constructor(
    private zone: NgZone,
    private router: Router,
    private session: SessionService,
    private tts: TtsService
  ) {}

  start() {
    this.clear();
    this.timer = setInterval(() => {
      if (Date.now() - this.session.state.lastInteraction > this.timeoutMs) {
        this.zone.run(() => {
          this.tts.stop();
          this.session.reset();
          this.router.navigateByUrl('/');
        });
      }
    }, 1000);
  }
  clear() {
    if (this.timer) clearInterval(this.timer);
  }
}
