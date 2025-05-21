import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Language } from '../types/app.types';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private currentLanguageSubject = new BehaviorSubject<Language>('pl');
    currentLanguage$ = this.currentLanguageSubject.asObservable();

    private translations: Record<Language, Record<string, string>> = {
        pl: {
            'welcome.title': 'Witaj w interaktywnej książce!',
            'welcome.subtitle': 'Wybierz język i gatunek, aby rozpocząć swoją przygodę',
            'language.select': 'Wybierz język',
            'genre.select': 'Wybierz gatunek',
            'genre.scifi': 'Science Fiction',
            'genre.scifi.desc': 'Odkryj niesamowite światy przyszłości',
            'genre.fantasy': 'Fantasy',
            'genre.fantasy.desc': 'Zanurz się w magicznym świecie',
            'genre.horror': 'Horror',
            'genre.horror.desc': 'Przeżyj przerażającą przygodę',
            'genre.romance': 'Romans',
            'genre.romance.desc': 'Doświadcz wzruszającej historii miłosnej',
            'genre.mystery': 'Kryminał',
            'genre.mystery.desc': 'Rozwiąż fascynującą zagadkę',
            'theme.toggle': 'Przełącz motyw',
            'theme.light': 'Tryb jasny',
            'theme.dark': 'Tryb ciemny',
            'continue': 'Kontynuuj',
            'you.chose': 'Wybrałeś:'
        },
        en: {
            'welcome.title': 'Welcome to the Interactive Book!',
            'welcome.subtitle': 'Choose your language and genre to begin your adventure',
            'language.select': 'Select Language',
            'genre.select': 'Select Genre',
            'genre.scifi': 'Science Fiction',
            'genre.scifi.desc': 'Discover amazing future worlds',
            'genre.fantasy': 'Fantasy',
            'genre.fantasy.desc': 'Immerse yourself in a magical world',
            'genre.horror': 'Horror',
            'genre.horror.desc': 'Experience a terrifying adventure',
            'genre.romance': 'Romance',
            'genre.romance.desc': 'Experience a touching love story',
            'genre.mystery': 'Mystery',
            'genre.mystery.desc': 'Solve an intriguing mystery',
            'theme.toggle': 'Toggle theme',
            'theme.light': 'Light Mode',
            'theme.dark': 'Dark Mode',
            'continue': 'Continue',
            'you.chose': 'You chose:'
        }
    };

    constructor() {}

    setLanguage(lang: Language): void {
        this.currentLanguageSubject.next(lang);
    }

    translate(key: string): string {
        const currentLang = this.currentLanguageSubject.value;
        return this.translations[currentLang][key] || key;
    }
} 