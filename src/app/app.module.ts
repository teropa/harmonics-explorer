import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';
import { CurveComponent } from './curve.component';
import { GainInputComponent } from './gain-input.component';
import { PartialComponent } from './partial.component';
import { harmonicsReducer } from './harmonics';
import { AudioService } from './audio.service';

import { appState } from '../hmr';

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.provideStore(harmonicsReducer, appState),
    EffectsModule
  ],
  declarations: [
    AppComponent,
    CurveComponent, 
    GainInputComponent,
    PartialComponent
  ],
  providers: [
    AudioService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
