import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule }from '@angular/http';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MdButtonModule } from '@angular2-material/button';
import { MdIconModule } from '@angular2-material/icon';
import { MdSliderModule } from '@angular2-material/slider';

import { AppComponent } from './app.component';
import { CurveComponent } from './curve.component';
import { GainInputComponent } from './gain-input.component';
import { NoteControlComponent } from './note-control.component';
import { PartialComponent } from './partial.component';
import { harmonicsReducer } from './harmonics';
import { AudioService } from './audio.service';
import { NoteService } from './note.service';
import { PresetsService } from './presets.service';

import { appState } from '../hmr';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    StoreModule.provideStore(harmonicsReducer, appState),
    EffectsModule,
    MdButtonModule,
    MdIconModule.forRoot(),
    MdSliderModule
  ],
  declarations: [
    AppComponent,
    CurveComponent, 
    GainInputComponent,
    PartialComponent,
    NoteControlComponent
  ],
  providers: [
    AudioService,
    NoteService,
    PresetsService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
