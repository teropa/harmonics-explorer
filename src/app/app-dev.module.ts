/*
 * The dev mode application NgModule.
 */ 
import { NgModule } from '@angular/core';
import { AppModule } from './app.module';
import { AppComponent } from './components/app.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  imports: [
    AppModule,
    StoreDevtoolsModule.instrumentOnlyWithExtension()
  ],
  bootstrap: [ AppComponent ]
})
export class AppDevModule { }
