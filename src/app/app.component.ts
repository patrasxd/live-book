import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguratorComponent } from './components/configurator/configurator.component';
import { StoryChatComponent } from './components/story-chat/story-chat.component';
import { AppStateService } from './core/services/app-state.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, ConfiguratorComponent, StoryChatComponent],
    template: `
        <ng-container *ngIf="(appState.showStory$ | async) === false">
            <app-configurator></app-configurator>
        </ng-container>
        <ng-container *ngIf="appState.showStory$ | async">
            <app-story-chat></app-story-chat>
        </ng-container>
    `
})
export class AppComponent {
    constructor(public appState: AppStateService) {}
}
