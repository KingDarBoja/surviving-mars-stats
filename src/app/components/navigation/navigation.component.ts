import { Component, DOCUMENT, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

type Theme = 'dark' | 'light';

@Component({
  standalone: true,
  imports: [MatButtonModule, MatToolbarModule, MatIconModule],
  selector: 'sms-navigation-bar',
  templateUrl: 'navigation.component.html',
})
export class NavigationComponent {
  private readonly _document = inject(DOCUMENT);

  selectedTheme = signal<Theme>('light');

  constructor() {
    const storedTheme = this.getThemeInLocalStorage();
    this.setTheme(storedTheme);
  }

  toggleTheme() {
    switch (this.selectedTheme()) {
      case 'light':
        this.setTheme('dark');
        break;
      case 'dark':
        this.setTheme('light');
        break;
    }
  }

  private setTheme(theme: Theme) {
    this.selectedTheme.set(theme);
    switch (theme) {
      case 'dark':
        this._document.documentElement.classList.add('dark-mode');
        this._document.body.dataset.agThemeMode = 'dark-mode';
        break;
      case 'light':
        this._document.documentElement.classList.remove('dark-mode');
        this._document.body.dataset.agThemeMode = 'light-mode';
        break;
    }
    this.setThemeInLocalStorage(theme);
  }

  private setThemeInLocalStorage(theme: Theme) {
    localStorage.setItem('preferred-theme', theme);
  }

  private getThemeInLocalStorage() {
    return (localStorage.getItem('preferred-theme') as Theme) ?? 'light';
  }
}
