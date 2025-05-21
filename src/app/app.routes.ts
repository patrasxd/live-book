import { Routes } from '@angular/router';
import { ConfiguratorComponent } from './components/configurator/configurator.component';
import { StoryChatComponent } from './components/story-chat/story-chat.component';

export const routes: Routes = [
  { path: '', component: ConfiguratorComponent },
  { path: 'story', component: StoryChatComponent }
];
