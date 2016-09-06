/*
 * This is the main entry point of the application,
 * and has been configured as such in the Webpack config
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { handleHmr } from './hmr';
import { AppModule } from './app/app.module';

if (process.env.ENV === 'production') {
  enableProdMode();
}

console.log('watei');

function bootstrap() {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule);
}

// We may bootstrap the app in one of two ways..
if ((<any>module).hot) {
  // A hot loading bootstrap. Delegate to handleHmr, see hmr.ts.
  handleHmr(module, bootstrap);
} else {
  // A regular (cold) bootstrap, when not doing hot loading. We just call
  // Angular's bootstrap directly from this module.
  bootstrap();
}