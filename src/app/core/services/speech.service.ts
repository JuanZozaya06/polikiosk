import { Injectable, NgZone } from '@angular/core';

type STTHandlers = {
  onResult: (finalText: string, interimText: string) => void;
  onEnd?: () => void;
  onError?: (e: any) => void;
};

@Injectable({ providedIn: 'root' })
export class SpeechService {
  private SR: any =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  private recognition: any | null = null;

  constructor(private zone: NgZone) {
    if (!this.SR) {
      console.warn('🟡 STT no soportado en este navegador.');
      return;
    }
    this.recognition = new this.SR();
    this.recognition.lang = 'es-VE'; // prueba 'es-VE', 'es-ES' o 'es-419'
    this.recognition.interimResults = true;
    this.recognition.continuous = false; // PTT: paramos con .stop()
    this.recognition.maxAlternatives = 1;
  }

  isSupported() {
    return !!this.recognition;
  }

  listen({ onResult, onEnd, onError }: STTHandlers) {
    if (!this.recognition) {
      onError?.('no-support');
      return;
    }

    let finalText = '';

    // ====== LOGS DE DIAGNÓSTICO ======
    this.recognition.onaudiostart = () =>
      console.log('🎙️ onaudiostart -> Chrome empezó a recibir audio');
    this.recognition.onaudioend = () =>
      console.log('🎙️ onaudioend   -> Chrome dejó de recibir audio');
    this.recognition.onsoundstart = () =>
      console.log('🔊 onsoundstart -> detectó sonido (no necesariamente voz)');
    this.recognition.onsoundend = () =>
      console.log('🔇 onsoundend   -> dejó de detectar sonido');
    this.recognition.onspeechstart = () =>
      console.log('🗣️ onspeechstart-> detectó VOZ');
    this.recognition.onspeechend = () =>
      console.log('🤐 onspeechend  -> dejó de detectar voz');
    this.recognition.onstart = () =>
      console.log('🏁 onstart       -> reconocimiento INICIADO');
    this.recognition.onend = () => {
      console.log('🏁 onend         -> reconocimiento FINALIZADO');
      this.zone.run(() => onEnd?.());
    };
    this.recognition.onnomatch = (e: any) =>
      console.log('❓ onnomatch     -> no entendió palabra/frase', e);

    this.recognition.onresult = (event: any) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const txt = res[0].transcript;
        if (res.isFinal) {
          finalText += txt + ' ';
          console.log('✅ onresult FINAL:', txt);
        } else {
          interim += txt;
          console.log('⌛ onresult PARCIAL:', txt);
        }
      }
      this.zone.run(() => onResult(finalText.trim(), interim.trim()));
    };

    this.recognition.onerror = (e: any) => {
      // e.error puede ser: 'no-speech', 'audio-capture', 'not-allowed', 'aborted', etc.
      console.error('❌ onerror:', e);
      this.zone.run(() => onError?.(e));
    };

    console.log('▶️ recognition.start()');
    this.recognition.start();
  }

  stop() {
    try {
      console.log('⏹️ recognition.stop()');
      this.recognition?.stop();
    } catch (e) {
      console.warn('stop() error', e);
    }
  }
}
