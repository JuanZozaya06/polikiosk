import { Injectable } from '@angular/core';

export interface SessionState {
  transcript: string;
  answer: string;
  thinking: boolean;
  lastInteraction: number;
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  state: SessionState = {
    transcript: '',
    answer: '',
    thinking: false,
    lastInteraction: Date.now(),
  };

  touch() {
    this.state.lastInteraction = Date.now();
  }
  reset() {
    this.state = {
      transcript: '',
      answer: '',
      thinking: false,
      lastInteraction: Date.now(),
    };
  }
}
