/*
 * The main application NgModule.
 */ 
import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MdButtonModule } from '@angular2-material/button';
import { MdIconModule } from '@angular2-material/icon';
import { MdSliderModule } from '@angular2-material/slider';

import { AppComponent } from './components/app.component';
import { ContainerComponent } from './components/container.component';
import { MainMenuComponent } from './components/main-menu.component';
import { CurveComponent } from './components/curve.component';
import { GainInputComponent } from './components/gain-input.component';
import { MuteControlComponent } from './components/mute-control.component'; 
import { NoteControlComponent } from './components/note-control.component';
import { PartialComponent } from './components/partial.component';

import { harmonicsReducer } from './harmonics';
import { AudioService } from './services/audio.service';
import { NoteService } from './services/note.service';
import { PresetsService } from './services/presets.service';

// This imports the variable that, in a hot loading situation, holds
// a reference to the previous application's last state before
// it was destroyed.
import { appState } from '../hmr';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule, // Used by Angular 2 Material
    HttpModule, // Used by Angular 2 Material (to load icons, apparently?)
    StoreModule.provideStore(harmonicsReducer, appState), 
    EffectsModule,
    MdButtonModule,
    MdIconModule.forRoot(),
    MdSliderModule
  ],
  declarations: [
    AppComponent,
    ContainerComponent,
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
