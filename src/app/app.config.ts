import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideNgtRenderer } from 'angular-three/dom';
import { lastValueFrom, tap } from 'rxjs';

import { appRoutes } from './app.routes';
import { registerAgGridModules } from './shared/ui-table/ui-table.register';
import { LocaleService } from './shared/services';

/** Register AG-Grid Modules by calling this function. */
registerAgGridModules();

/** Pre-load locale data on APP INIT. */
function initializerLocaleFn() {
  const localeService = inject(LocaleService);

  console.log('APP_INITIALIZER: Fetching locale data...');
  return lastValueFrom(
    localeService.initializeLocaleData().pipe(
      tap(() => {
        console.log('APP_INITIALIZER: Preloaded locale data.');
      }),
    ),
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideNgtRenderer(),
    provideAppInitializer(() => {
      return initializerLocaleFn();
    }),
  ],
};
