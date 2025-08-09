import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TtsService {
  speak(text: string) {
    if (!('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'es-ES';
    utter.rate = 1; // velocidad natural
    utter.pitch = 1; // tono neutro
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }
  stop() {
    window.speechSynthesis.cancel();
  }
}
