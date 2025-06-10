import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LanguageService } from './language.service';
import { AppStateService } from './app-state.service';
import { Language } from '../types/app.types';
import { firstValueFrom } from 'rxjs';

type SupportedLanguage = Language | 'es' | 'de';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private sessionId: string | null = null;
  private messageCount: number = 0;

  constructor(
    private http: HttpClient,
    private languageService: LanguageService,
    private appState: AppStateService
  ) {}

  async startStory(genre: string, language: string): Promise<string> {
    this.messageCount = 0;
    try {
      const response = await this.http.post<{ sessionId: string, text: string }>(
        `${environment.apiUrl}/story/start`,
        { genre, language }
      ).toPromise();

      if (response) {
        this.sessionId = response.sessionId;
        return response.text;
      }
      throw new Error('No response from server');
    } catch (error) {
      console.error('Error generating story:', error);
      throw error;
    }
  }

  async continueStory(selectedOption: string): Promise<string> {
    if (!this.sessionId) {
      throw new Error('No active story session');
    }

    this.messageCount++;
    try {
      const response = await this.http.post<{ text: string }>(
        `${environment.apiUrl}/story/continue`,
        {
          sessionId: this.sessionId,
          selectedOption
        }
      ).toPromise();

      if (response) {
        return response.text;
      }
      throw new Error('No response from server');
    } catch (error) {
      console.error('Error continuing story:', error);
      throw error;
    }
  }

  async finalizeStory(): Promise<string> {
    if (!this.sessionId) {
      throw new Error('No active story session');
    }

    const thankYouMessages: Record<SupportedLanguage, string> = {
      'pl': 'Dziękujemy za wspólną przygodę! Mamy nadzieję, że historia Ci się spodobała.',
      'en': 'Thank you for sharing this adventure! We hope you enjoyed the story.',
      'es': '¡Gracias por compartir esta aventura! Esperamos que hayas disfrutado la historia.',
      'de': 'Danke, dass du dieses Abenteuer mit uns geteilt hast! Wir hoffen, dir hat die Geschichte gefallen.'
    };

    try {
      const currentLanguage = await firstValueFrom(this.appState.language$) || 
                            await firstValueFrom(this.languageService.currentLanguage$);
      
      const response = await this.http.post<{ text: string }>(
        `${environment.apiUrl}/story/finalize`,
        {
          sessionId: this.sessionId,
          language: currentLanguage
        }
      ).toPromise();

      if (response) {
        const thankYouMessage = thankYouMessages[currentLanguage.toLowerCase() as SupportedLanguage] || thankYouMessages['en'];
        this.sessionId = null;
        return `${response.text}\n\n${thankYouMessage}`;
      }
      throw new Error('No response from server');
    } catch (error) {
      console.error('Error finalizing story:', error);
      throw error;
    }
  }
} 