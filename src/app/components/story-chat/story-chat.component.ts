import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GeminiService } from '../../core/services/gemini.service';
import { ThemeService } from '../../core/services/theme.service';
import { NavPanelComponent } from '../nav-panel/nav-panel.component';
import { AppStateService } from '../../core/services/app-state.service';

interface StoryPart {
  text: string;
  imageDescription: string;
  options: string[];
  isLoading?: boolean;
  selectedOption?: string;
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
    private appState: AppStateService
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

    // Extract image description
    const imageDescriptionMatch = response.match(/<Image description>(.*?)<\/Image description>/s);
    part.imageDescription = imageDescriptionMatch ? imageDescriptionMatch[1].trim() : '';

    // Extract options
    const optionsMatches = response.match(/<Option [A-C]>(.*?)<\/Option [A-C]>/g);
    part.options = optionsMatches 
      ? optionsMatches.map(match => {
          const optionText = match.match(/<Option [A-C]>(.*?)<\/Option [A-C]>/);
          return optionText ? optionText[1].trim() : '';
        })
      : [];

    // Clean up the story text
    part.text = response
      .replace(/<Title>.*?<\/Title>/s, '')
      .replace(/<Image description>.*?<\/Image description>/s, '')
      .replace(/<Option [A-C]>.*?<\/Option [A-C]>/g, '')
      .trim();
  }

  async selectOption(option: string, currentPart: StoryPart) {
    currentPart.selectedOption = option;

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
      const element = this.storyContainer.nativeElement;
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  }
} 