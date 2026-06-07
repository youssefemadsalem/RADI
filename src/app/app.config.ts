import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideLucideIcons, LucideShoppingBag } from '@lucide/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideLucideIcons(LucideShoppingBag), 

    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions(), withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      })),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
  ],
};