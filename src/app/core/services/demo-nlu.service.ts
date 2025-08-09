import { Injectable } from '@angular/core';
import intents from '../../../assets/intents.json';

interface IntentItem {
  intent: string;
  keywords: string[];
  response: string;
  response_tts?: boolean;
}

@Injectable({ providedIn: 'root' })
export class DemoNluService {
  private intents: IntentItem[] = intents as any;

  match(query: string): IntentItem | null {
    const q = (query || '').toLowerCase();
    for (const it of this.intents) {
      const hit = it.keywords.some((k) => q.includes(k.toLowerCase()));
      if (hit) return it;
    }
    return null;
  }
}
