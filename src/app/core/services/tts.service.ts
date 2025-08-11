// tts.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TtsService {
  private current?: HTMLAudioElement;
  constructor(private http: HttpClient) {}

  async speak(
    text: string,
    opts?: {
      lang?: string;
      voiceName?: string;
      rate?: number;
      pitch?: number;
      format?: 'mp3' | 'ogg';
    }
  ) {
    this.stop();
    const params = {
      q: text,
      lang: opts?.lang || 'es-US',
      voiceName: opts?.voiceName || 'es-US-Studio-B',
      rate: String(opts?.rate ?? 1),
      pitch: String(opts?.pitch ?? 0),
      format: opts?.format || 'mp3',
    };
    const url = `${environment.apiBase}/tts`;
    const blob = await this.http
      .get(url, { params, responseType: 'blob' as const })
      .toPromise();
    if (!blob) return;
    const src = URL.createObjectURL(blob);
    this.current = new Audio(src);
    await this.current.play().catch(() => {
      /* requiere user-gesture si está bloqueado */
    });
    this.current.onended = () => URL.revokeObjectURL(src);
  }

  stop() {
    try {
      this.current?.pause();
    } catch {}
    this.current = undefined;
  }
}
