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
  templateUrl: './nav-panel.component.html',
  styleUrls: ['./nav-panel.component.css']
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