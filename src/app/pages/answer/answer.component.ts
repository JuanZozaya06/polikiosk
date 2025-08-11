import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SessionService } from '../../core/services/session.service';
import { TtsService } from '../../core/services/tts.service';

@Component({
  selector: 'app-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css'],
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
})
export class AnswerComponent implements OnInit {
  constructor(
    public session: SessionService,
    private tts: TtsService,
    private router: Router
  ) {}
  ngOnInit() {
    this.session.touch();
    this.tts.speak(this.session.state.answer, {
      lang: 'es-MX',
      voiceName: 'es-US-Studio-B',
    });
  }
  repeat() {
    this.tts.speak(this.session.state.answer, {
      lang: 'es-MX',
      voiceName: 'es-US-Studio-B',
    });
  }
  newQuestion() {
    this.tts.stop();
    this.session.reset();
    this.router.navigateByUrl('/');
  }
}
