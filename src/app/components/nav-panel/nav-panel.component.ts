import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { LanguageService } from '../../core/services/language.service';
import { AppStateService } from '../../core/services/app-state.service';

@Component({
  selector: 'app-nav-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Left side -->
          <div class="flex items-center">
            <a (click)="goHome()" class="text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </a>
            <span class="ml-4 text-lg font-medium text-gray-800 dark:text-white">{{ pageName }}</span>
          </div>

          <!-- Right side -->
          <div class="flex items-center">
          <button 
                (click)="toggleDarkMode()" 
                class="group px-4 py-2 rounded-lg font-medium
                       bg-white dark:bg-gray-800 
                       text-gray-900 dark:text-white
                       border border-gray-200 dark:border-gray-700
                       hover:bg-gray-100 dark:hover:bg-gray-700 
                       transition-all duration-300 ease-in-out
                       hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg
                       active:scale-95 active:translate-y-0">
                <span class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                         class="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" 
                         [class.rotate-180]="isDarkMode"
                         fill="none" 
                         viewBox="0 0 24 24" 
                         stroke="currentColor">
                        <path *ngIf="!isDarkMode" 
                              stroke-linecap="round" 
                              stroke-linejoin="round" 
                              stroke-width="2" 
                              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                        <path *ngIf="isDarkMode" 
                              stroke-linecap="round" 
                              stroke-linejoin="round" 
                              stroke-width="2" 
                              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/>
                    </svg>
                    <span class="text-fade">
                        {{ isDarkMode ? languageService.translate('theme.light') : languageService.translate('theme.dark') }}
                    </span>
                </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavPanelComponent {
  @Input() pageName: string = '';
  isDarkMode: boolean = false;

  constructor(private themeService: ThemeService,
    public languageService: LanguageService,
    private appStateService: AppStateService
  ) {
    this.isDarkMode = this.themeService.isDarkMode();
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  goHome() {
    this.appStateService.resetState();
  }
} 