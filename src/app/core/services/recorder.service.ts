import { Injectable } from '@angular/core';

export interface AudioDevice {
  deviceId: string;
  label: string;
}

@Injectable({ providedIn: 'root' })
export class RecorderService {
  private rec?: MediaRecorder;
  private chunks: BlobPart[] = [];
  private currentStream?: MediaStream;
  private preferredDeviceId?: string;

  async listMics(): Promise<AudioDevice[]> {
    // Para ver labels, el sitio debe tener permiso de mic al menos una vez
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter((d) => d.kind === 'audioinput')
      .map((d) => ({ deviceId: d.deviceId, label: d.label || '(Micrófono)' }));
  }

  setDevice(deviceId: string) {
    this.preferredDeviceId = deviceId;
  }

  async start() {
    this.stopStreamOnly();

    const constraints: MediaStreamConstraints = {
      audio: {
        deviceId: this.preferredDeviceId
          ? { exact: this.preferredDeviceId }
          : undefined,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    };

    // pedir stream
    this.currentStream = await navigator.mediaDevices.getUserMedia(constraints);

    // log: qué dispositivo quedó activo
    const track = this.currentStream.getAudioTracks()[0];
    console.log('🎙️ usando dispositivo:', track.getSettings()); // <- mira deviceId, sampleRate, etc.

    // escoger mime
    const mime = (MediaRecorder as any).isTypeSupported?.(
      'audio/webm;codecs=opus'
    )
      ? { mimeType: 'audio/webm;codecs=opus' }
      : (MediaRecorder as any).isTypeSupported?.('audio/webm')
      ? { mimeType: 'audio/webm' }
      : undefined;

    this.chunks = [];
    this.rec = new MediaRecorder(this.currentStream, mime);
    this.rec.ondataavailable = (e) => this.chunks.push(e.data);
    this.rec.start();
  }

  async stop(): Promise<Blob> {
    if (!this.rec) {
      return new Blob([], { type: 'audio/webm' }); // no lances error
    }
    return new Promise<Blob>((resolve) => {
      this.rec!.onstop = () => {
        const blob = new Blob(this.chunks, { type: 'audio/webm' });
        this.stopStreamOnly();
        resolve(blob);
      };
      this.rec!.stop();
    });
  }

  private stopStreamOnly() {
    this.rec = undefined;
    if (this.currentStream) {
      this.currentStream.getTracks().forEach((t) => t.stop());
      this.currentStream = undefined;
    }
  }
}
