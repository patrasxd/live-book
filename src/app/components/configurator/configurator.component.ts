import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { ThemeService } from '../../core/services/theme.service';
import { Language, Genre, GenreOption } from '../../core/types/app.types';
import { AppStateService } from '../../core/services/app-state.service';

@Component({
    selector: 'app-configurator',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './configurator.component.html',
    styleUrls: ['./configurator.component.css']
})
export class ConfiguratorComponent implements OnInit {
    languages: Language[] = ['pl', 'en'];
    selectedLanguage: Language = 'pl';
    selectedGenre?: Genre;
    isDarkMode = false;

    genres: GenreOption[] = [
        { id: 'scifi', icon: '🚀', titleKey: 'genre.scifi', descriptionKey: 'genre.scifi.desc' },
        { id: 'fantasy', icon: '🧙‍♂️', titleKey: 'genre.fantasy', descriptionKey: 'genre.fantasy.desc' },
        { id: 'horror', icon: '👻', titleKey: 'genre.horror', descriptionKey: 'genre.horror.desc' },
        { id: 'romance', icon: '💝', titleKey: 'genre.romance', descriptionKey: 'genre.romance.desc' },
        { id: 'mystery', icon: '🔍', titleKey: 'genre.mystery', descriptionKey: 'genre.mystery.desc' }
    ];

    constructor(
        public languageService: LanguageService,
        public themeService: ThemeService,
        private appState: AppStateService
    ) {
        this.isDarkMode = this.themeService.isDarkMode();
    }

    ngOnInit(): void {
        this.languageService.currentLanguage$.subscribe(lang => {
            this.selectedLanguage = lang;
        });

        this.themeService.darkMode$.subscribe(isDark => {
            this.isDarkMode = isDark;
        });
    }

    onLanguageChange(lang: Language): void {
        this.languageService.setLanguage(lang);
    }

    onGenreSelect(genre: Genre): void {
        this.selectedGenre = genre;
    }

    onContinue(): void {
        if (this.selectedGenre) {
            this.appState.startStory(this.selectedGenre, this.selectedLanguage);
        }
    }

    toggleDarkMode(): void {
        this.themeService.toggleDarkMode();
    }
} 