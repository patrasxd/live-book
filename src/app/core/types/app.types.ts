export type Language = 'pl' | 'en';

export type Genre = 'scifi' | 'fantasy' | 'horror' | 'romance' | 'mystery';

export interface AppConfig {
    language: Language;
    genre?: Genre;
    darkMode: boolean;
}

export interface GenreOption {
    id: Genre;
    icon: string;
    titleKey: string;
    descriptionKey: string;
} 