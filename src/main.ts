import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { handleHmr } from './hmr';
import { AppModule } from './app/app.module';

if (process.env.ENV === 'production') {
  enableProdMode();
}

function main() {
  return platformBrowserDynamic()
    .bootstrapModule(AppModule);
}

if ((<any>module).hot) {
  handleHmr(module, main);
} else {
  main();
}