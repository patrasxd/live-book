import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
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
  private genAI: GoogleGenerativeAI;
  private model: any;
  private chat: any;
  private messageCount: number = 0;

  constructor(
    private languageService: LanguageService,
    private appState: AppStateService
  ) {
    this.genAI = new GoogleGenerativeAI(environment.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    this.startNewChat();
  }

  private startNewChat() {
    this.chat = this.model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 2000,
      },
    });
  }

  async startStory(genre: string, language: string): Promise<string> {
    this.messageCount = 0;
    // Start a new chat session
    this.startNewChat();
    
    const prompt = `You are an interactive book in which the reader can choose how the plot will unfold.

The type of the book is ${genre}, and its language is ${language}. Just start the story without telling that you are starting. Add title at the beginning with the tag <Title>Title</Title>. Each time, the user will have 3 options to choose from (generated by you (A, B, C) labeled accordingly:

<Option A>You click the button and wait to see what happens</Option A>

In addition, add a verbal description of the image, which will describe the scene a bit. Label it like this:

<Image description>Description</Image description>

Whole message should be in the language described previously. Each history can end and it depends on your choices. If the story will end (it can be ended after minimum 5 messages, but the longest 20) - there will be two options:
(These are only examples)
<End Return>The last option - you will end your story and there wont be any new options</End Return>
<Continue Story>Something strange will happen - like god mode or something - and your store will be in the endless mode</Continue Story>`;

    try {
      const result = await this.chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating story:', error);
      throw error;
    }
  }

  async continueStory(selectedOption: string): Promise<string> {
    this.messageCount++;
    const shouldConsiderEnding = this.messageCount >= 5;
    
    const prompt = `User selected: ${selectedOption}\n\nContinue the story based on this choice. ${
      shouldConsiderEnding ? 'Since we have reached at least 5 messages, you can decide to end the story with <End Return> or <Continue Story> tags if you feel it\'s appropriate. If you decide to continue normally, provide the standard options A, B, C.' : 'Remember to provide new options (A, B, C)'
    } Always include an image description for the new scene. Use the same format as before.`;

    try {
      const result = await this.chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error continuing story:', error);
      throw error;
    }
  }

  async finalizeStory(): Promise<string> {
    const thankYouMessages: Record<SupportedLanguage, string> = {
      'pl': 'Dziękujemy za wspólną przygodę! Mamy nadzieję, że historia Ci się spodobała.',
      'en': 'Thank you for sharing this adventure! We hope you enjoyed the story.',
      'es': '¡Gracias por compartir esta aventura! Esperamos que hayas disfrutado la historia.',
      'de': 'Danke, dass du dieses Abenteuer mit uns geteilt hast! Wir hoffen, dir hat die Geschichte gefallen.'
    };

    const prompt = 'Please provide a final, satisfying conclusion to the story that wraps up the main plot points and gives closure to the reader. Keep the same language as before.';

    try {
      const result = await this.chat.sendMessage(prompt);
      const response = await result.response;
      const currentLanguage = await firstValueFrom(this.appState.language$) || 
                            await firstValueFrom(this.languageService.currentLanguage$);
      const thankYouMessage = thankYouMessages[currentLanguage.toLowerCase() as SupportedLanguage] || thankYouMessages['en'];
      return `${response.text()}\n\n${thankYouMessage}`;
    } catch (error) {
      console.error('Error finalizing story:', error);
      throw error;
    }
  }
} 