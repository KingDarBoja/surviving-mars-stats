import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [MatButtonModule, MatToolbarModule, MatIconModule],
  selector: 'sms-navigation-bar',
  templateUrl: 'navigation.component.html',
})
export class NavigationComponent {}
