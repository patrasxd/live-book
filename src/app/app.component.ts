import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguratorComponent } from './components/configurator/configurator.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, ConfiguratorComponent],
    template: `<app-configurator></app-configurator>`
})
export class AppComponent {
    title = 'live-book';
}
