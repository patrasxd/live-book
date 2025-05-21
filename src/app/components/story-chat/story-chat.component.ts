import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GeminiService } from '../../core/services/gemini.service';
import { ThemeService } from '../../core/services/theme.service';
import { NavPanelComponent } from '../nav-panel/nav-panel.component';
import { AppStateService } from '../../core/services/app-state.service';
import { LanguageService } from '../../core/services/language.service';

interface StoryPart {
  text: string;
  imageDescription: string;
  options: string[];
  isLoading?: boolean;
  selectedOption?: string;
  endReturn?: string;
  continueStory?: string;
}

@Component({
  selector: 'app-story-chat',
  standalone: true,
  imports: [CommonModule, RouterModule, NavPanelComponent],
  templateUrl: './story-chat.component.html',
  styleUrls: ['../../../styles.css']
})
export class StoryChatComponent implements OnInit {
  @ViewChild('storyContainer') private storyContainer!: ElementRef;
  
  storyParts: StoryPart[] = [];
  storyTitle: string = '';

  constructor(
    private geminiService: GeminiService,
    private themeService: ThemeService,
    private appState: AppStateService,
    public languageService: LanguageService
  ) {}

  ngOnInit() {
    this.appState.genre$.subscribe(genre => {
      this.appState.language$.subscribe(language => {
        if (genre && language) {
          this.startStory(genre, language);
        }
      });
    });
  }

  private async startStory(genre: string, language: string) {
    const newPart: StoryPart = {
      text: '',
      imageDescription: '',
      options: [],
      isLoading: true
    };
    this.storyParts.push(newPart);

    try {
      const response = await this.geminiService.startStory(genre, language);
      this.processResponse(response, newPart);
    } catch (error) {
      console.error('Error starting story:', error);
      newPart.text = 'Error starting the story. Please try again.';
    } finally {
      newPart.isLoading = false;
      this.scrollToBottom();
    }
  }

  private processResponse(response: string, part: StoryPart) {
    // Extract title
    const titleMatch = response.match(/<Title>(.*?)<\/Title>/s);
    if (titleMatch && !this.storyTitle) {
      this.storyTitle = titleMatch[1].trim();
    }

    // Extract image description - handle both closing tag formats
    const imageDescriptionMatch = response.match(/<Image description>(.*?)<\/Image description>/s);
    part.imageDescription = imageDescriptionMatch ? imageDescriptionMatch[1].trim() : '';

    // Extract End Return and Continue Story options
    const endReturnMatch = response.match(/<End Return>(.*?)<\/End Return>/s);
    const continueStoryMatch = response.match(/<Continue Story>(.*?)<\/Continue Story>/s);

    if (endReturnMatch || continueStoryMatch) {
      part.endReturn = endReturnMatch ? endReturnMatch[1].trim() : undefined;
      part.continueStory = continueStoryMatch ? continueStoryMatch[1].trim() : undefined;
      part.options = [];
      
      if (part.endReturn) {
        part.options.push(part.endReturn);
      }
      if (part.continueStory) {
        part.options.push(part.continueStory);
      }
    } else {
      // Extract regular options
      const optionsMatches = response.match(/<Option [A-C]>(.*?)<\/Option [A-C]>/g);
      part.options = optionsMatches 
        ? optionsMatches.map(match => {
            const optionText = match.match(/<Option [A-C]>(.*?)<\/Option [A-C]>/);
            return optionText ? optionText[1].trim() : '';
          })
        : [];
    }

    // Clean up the story text
    part.text = response
      .replace(/<Title>.*?<\/Title>/s, '')
      .replace(/<Image description>.*?<\/Image description>/s, '')
      .replace(/<Option [A-C]>.*?<\/Option [A-C]>/g, '')
      .replace(/<End Return>.*?<\/End Return>/s, '')
      .replace(/<Continue Story>.*?<\/Continue Story>/s, '')
      .trim();
  }

  async selectOption(option: string, currentPart: StoryPart) {
    currentPart.selectedOption = option;

    // If this was an End Return option, we don't continue the story
    if (option === currentPart.endReturn) {
      return;
    }

    const newPart: StoryPart = {
      text: '',
      imageDescription: '',
      options: [],
      isLoading: true
    };
    this.storyParts.push(newPart);
    
    try {
      const response = await this.geminiService.continueStory(option);
      this.processResponse(response, newPart);
    } catch (error) {
      console.error('Error continuing story:', error);
      newPart.text = 'Error continuing the story. Please try again.';
    } finally {
      newPart.isLoading = false;
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const storyParts = this.storyContainer.nativeElement.children;
      if (storyParts.length > 0) {
        const lastPart = storyParts[storyParts.length - 1];
        const headerOffset = 80; // Wysokość nagłówka (nav-panel)
        const elementPosition = lastPart.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  }
} 