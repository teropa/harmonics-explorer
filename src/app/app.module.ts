import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppComponent } from './app.component';
import { CurveComponent } from './curve.component';
import { PartialComponent } from './partial.component';
import { harmonicsReducer } from './harmonics';
import { AudioService } from './audio.service';

@NgModule({
  imports: [
    BrowserModule,
    StoreModule.provideStore(harmonicsReducer),
    EffectsModule
  ],
  declarations: [
    AppComponent,
    CurveComponent, 
    PartialComponent
  ],
  providers: [
    AudioService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
