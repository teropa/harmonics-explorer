import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule }from '@angular/http';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MdButtonModule } from '@angular2-material/button';
import { MdIconModule } from '@angular2-material/icon';
import { MdSliderModule } from '@angular2-material/slider';

import { AppComponent } from './components/app.component';
import { MainMenuComponent } from './components/main-menu.component';
import { CurveComponent } from './components/curve.component';
import { GainInputComponent } from './components/gain-input.component';
import { MuteControlComponent } from './components/mute-control.component'; 
import { NoteControlComponent } from './components/note-control.component';
import { PartialComponent } from './components/partial.component';

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
    MainMenuComponent,
    CurveComponent, 
    GainInputComponent,
    MuteControlComponent,
    NoteControlComponent,
    PartialComponent
  ],
  providers: [
    AudioService,
    NoteService,
    PresetsService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
