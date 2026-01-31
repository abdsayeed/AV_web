import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { NotificationsComponent } from './shared/components/notifications/notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent, NotificationsComponent],
  template: `
    <router-outlet></router-outlet>
    <app-loading></app-loading>
    <app-notifications></app-notifications>
  `
})
export class RootComponent {}
