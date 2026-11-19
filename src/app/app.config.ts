import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideFileRouter } from '@analogjs/router';
import { provideGreenKeeperDependencies } from '@composition/index';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideFileRouter(),
    ...provideGreenKeeperDependencies(),
  ],
};
