import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private darkModeSubject = new BehaviorSubject<boolean>(this.initializeTheme());
    darkMode$ = this.darkModeSubject.asObservable();

    constructor() {
        // Listen for system changes if no theme is set
        if (!('theme' in localStorage)) {
            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', e => this.toggleDarkMode(e.matches));
        }
    }

    private initializeTheme(): boolean {
        // On page load or when changing themes, best to add inline in `head` to avoid FOUC
        const isDark = localStorage['theme'] === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

        this.updateHTMLClass(isDark);
        return isDark;
    }

    private updateHTMLClass(isDark: boolean): void {
        // On the next tick to ensure document is available
        setTimeout(() => {
            if (isDark) {
                document.documentElement.classList.add('dark');
                localStorage['theme'] = 'dark';
            } else {
                document.documentElement.classList.remove('dark');
                localStorage['theme'] = 'light';
            }
        });
    }

    toggleDarkMode(isDark?: boolean): void {
        const newValue = isDark !== undefined ? isDark : !this.darkModeSubject.value;
        this.darkModeSubject.next(newValue);
        this.updateHTMLClass(newValue);
    }

    isDarkMode(): boolean {
        return this.darkModeSubject.value;
    }

    // Method to respect system preference
    useSystemTheme(): void {
        localStorage.removeItem('theme');
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.toggleDarkMode(isDark);
    }
} 