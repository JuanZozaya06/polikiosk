import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { AskComponent } from './pages/ask/ask.component';
import { ThinkingComponent } from './pages/thinking/thinking.component';
import { AnswerComponent } from './pages/answer/answer.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'ask', component: AskComponent },
  { path: 'thinking', component: ThinkingComponent },
  { path: 'answer', component: AnswerComponent },
  { path: '**', redirectTo: '' },
];
