import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SessionService } from '../../core/services/session.service';
import {
  RecorderService,
  AudioDevice,
} from '../../core/services/recorder.service';

@Component({
  selector: 'app-ask',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ask.component.html',
  styleUrls: ['./ask.component.css'],
})
export class AskComponent implements OnInit, OnDestroy {
  listening = false;
  interim = '';
  errorMsg = '';

  // mics
  mics: AudioDevice[] = [];
  selectedMic = '';

  previewUrl = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public session: SessionService,
    private rec: RecorderService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    // prefill desde chip
    const prefill = this.route.snapshot.queryParamMap.get('prefill');
    if (prefill) {
      this.session.state.transcript = prefill;
      this.proceed();
    }

    // solicita permiso una vez para que se vean los labels de los mics
    try {
      const tmp = await navigator.mediaDevices.getUserMedia({ audio: true });
      tmp.getTracks().forEach((t) => t.stop());
    } catch {
      // si el usuario no da permiso aún, igual listamos (sin labels)
    }

    // lista mics y selecciona el primero
    this.mics = await this.rec.listMics();
    if (this.mics.length) {
      this.selectedMic = this.mics[0].deviceId;
      this.rec.setDevice(this.selectedMic);
    }
  }

  onMicChange() {
    this.rec.setDevice(this.selectedMic);
    console.log('🔧 mic seleccionado:', this.selectedMic);
  }

  // PTT
  async startListening() {
    this.errorMsg = '';
    this.listening = true;
    this.session.state.transcript = '';
    this.interim = '';
    try {
      await this.rec.start();
      console.log('🎤 grabando… (mantén presionado)');
    } catch (e: any) {
      console.error('Mic error:', e);
      this.errorMsg = 'No se pudo acceder al micrófono.';
      this.listening = false;
    }
  }

  async stopListening() {
    if (!this.listening) return;
    this.listening = false;
    try {
      const blob = await this.rec.stop();

      // 👇 PREVIEW: crea una URL reproducible del blob
      this.previewUrl && URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = URL.createObjectURL(blob);
      console.log('🎧 preview url:', this.previewUrl);

      // (opcional) descarga rápida para inspeccionar el archivo
      // const a = document.createElement('a');
      // a.href = this.previewUrl; a.download = 'grabacion.webm'; a.click();

      // envía al backend como ya lo hacías
      const form = new FormData();
      form.append('file', blob, 'audio.webm');
      const resp = await this.http
        .post<{ text: string }>(`${environment.apiBase}/transcribe`, form)
        .toPromise();
      this.session.state.transcript = resp?.text || '';
      console.log('✅ transcripción:', this.session.state.transcript);
      if (!this.session.state.transcript) {
        this.errorMsg =
          'No se entendió audio (muy corto o silencioso). Intente de nuevo.';
      } else {
        this.proceed();
      }
    } catch (e) {
      console.error('Transcribe error:', e);
      this.errorMsg = 'Error al transcribir audio.';
    }
  }

  proceed() {
    if ((this.session.state.transcript || '').trim().length === 0) return;
    this.router.navigateByUrl('/thinking');
  }

  ngOnDestroy() {
    try {
      this.rec['stop']?.();
    } catch {}
    this.previewUrl && URL.revokeObjectURL(this.previewUrl);
  }
}
