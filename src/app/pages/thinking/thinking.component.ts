import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../core/services/session.service';
import { DemoNluService } from '../../core/services/demo-nlu.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  selector: 'app-thinking',
  templateUrl: './thinking.component.html',
  styleUrls: ['./thinking.component.css'],
})
export class ThinkingComponent implements OnInit {
  tips = [
    'Consultando información local...',
    'Aplicando lineamientos de atención ciudadana...',
    'Preparando respuesta clara y breve...',
  ];
  idx = 0;

  constructor(
    private router: Router,
    private session: SessionService,
    private nlu: DemoNluService
  ) {}

  ngOnInit() {
    this.session.touch();
    const q = this.session.state.transcript;
    // Delay simulado (200ms por palabra, min 1.2s, max 3.5s)
    const words = Math.max(6, Math.min(18, (q || '').split(/\s+/).length));
    const delay = Math.max(1200, Math.min(3500, words * 200));

    const t = setInterval(() => {
      this.idx = (this.idx + 1) % this.tips.length;
    }, 800);

    setTimeout(() => {
      const intent = this.nlu.match(q || '');
      const personaPrefix = 'Buenos días. Con gusto le apoyo. ';
      const fallback =
        'Puedo orientarle en denuncias, tránsito, constancias y números de contacto. ¿Desea ver opciones?';
      this.session.state.answer =
        personaPrefix + (intent?.response || fallback);
      clearInterval(t);
      this.router.navigateByUrl('/answer');
    }, delay);
  }
}
