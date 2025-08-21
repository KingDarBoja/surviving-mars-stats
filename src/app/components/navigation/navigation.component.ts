import { Component, DOCUMENT, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router } from '@angular/router';
import { filter, tap } from 'rxjs';

type Theme = 'dark' | 'light';

enum LogoUrl {
  VANILLA = '/icons/official/vanilla_logo_base.png',
  RELAUNCHED = '/icons/official/relaunched_logo_base.png',
}

@Component({
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatToolbarModule, MatIconModule],
  selector: 'sms-navigation-bar',
  templateUrl: 'navigation.component.html',
  styles: [
    `
      #nav-logo {
        height: 48px;
      }
    `,
  ],
})
export class NavigationComponent {
  private readonly _document = inject(DOCUMENT);
  private readonly _router = inject(Router);

  selectedTheme = signal<Theme>('light');
  logoUrl = signal<string>(LogoUrl.VANILLA);

  constructor() {
    const storedTheme = this.getThemeInLocalStorage();
    this.setTheme(storedTheme);

    this._router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      tap((event) => {
        if (event.url === '/relaunched') {
          this.logoUrl.set(LogoUrl.RELAUNCHED);
        } else {
          this.logoUrl.set(LogoUrl.VANILLA);
        }
      })
    ).subscribe()
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
