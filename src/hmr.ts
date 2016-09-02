import { ApplicationRef, NgModuleRef } from '@angular/core';
import { Store } from '@ngrx/store';

export let appState: any;

export function handleHmr(module: any, bootstrap: () => Promise<NgModuleRef<any>>) {

  let moduleRef: NgModuleRef<any>;

  bootstrap()
    .then((mod: NgModuleRef<any>) => moduleRef = mod);

  module.hot.accept();

  module.hot.dispose(() => {
    const appRef: ApplicationRef = moduleRef.injector.get(ApplicationRef);
    const store: Store<any> = moduleRef.injector.get(Store);
    store.take(1).subscribe(s => appState = s);

    appRef.components.forEach(cmp => {
      const node = cmp.location.nativeElement;
      const newNode = document.createElement(node.tagName);
      node.parentNode.insertBefore(newNode, node);
    });
    moduleRef.destroy();
  });

}