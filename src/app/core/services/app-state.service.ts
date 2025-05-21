import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private showStorySubject = new BehaviorSubject<boolean>(false);
  private genreSubject = new BehaviorSubject<string>('');
  private languageSubject = new BehaviorSubject<string>('');

  showStory$ = this.showStorySubject.asObservable();
  genre$ = this.genreSubject.asObservable();
  language$ = this.languageSubject.asObservable();

  startStory(genre: string, language: string) {
    this.genreSubject.next(genre);
    this.languageSubject.next(language);
    this.showStorySubject.next(true);
  }

  resetState() {
    this.showStorySubject.next(false);
    this.genreSubject.next('');
    this.languageSubject.next('');
  }
} 