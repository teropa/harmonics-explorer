/*
 * Main application component. Renders the top-level layout and its individual
 * subcomponents.
 * 
 * This is also the only "smart component" in this application. We only subscribe
 * to @ngrx/store here, and also only dispatch actions to @ngrx/store here.
 * Other components are stateless and know nothing about the store.
 */
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { List } from 'immutable';
import {
  CHANGE_AMPLITUDE,
  CHANGE_MASTER_GAIN,
  CHANGE_FUNDAMENTAL_FREQUENCY,
  START,
  STOP,
  SWITCH_TO_PRESET
} from '../harmonics.reducer';
import { AppState } from '../app-state';
import { Partial } from '../partial';
import { Preset } from '../services/presets.service';

@Component({
  selector: 'hs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  partials$: Observable<List<Partial>>;
  masterGain$: Observable<number>;
  playing$: Observable<boolean>;

  constructor(private store: Store<AppState>) {
    this.partials$ = <Observable<List<Partial>>>store.select('partials');
    this.masterGain$ = <Observable<number>>store.select('masterGain');
    this.playing$ = <Observable<boolean>>store.select('playing');
  }

  changeAmplitude({partial, amplitude}: {partial: number, amplitude: number}) {
    this.store.dispatch({
      type: CHANGE_AMPLITUDE,
      payload: {partial, amplitude}
    })
  }

  changeMasterGain(gain: number) {
    this.store.dispatch({
      type: CHANGE_MASTER_GAIN,
      payload: gain
    });
  }

  changeFundamentalFrequency(freq: number) {
    this.store.dispatch({
      type: CHANGE_FUNDAMENTAL_FREQUENCY,
      payload: freq
    });
  }

  start() {
    this.store.dispatch({type: START});
  }

  stop() {
    this.store.dispatch({type: STOP});
  }

  switchToPreset(preset: Preset) {
    this.store.dispatch({type: SWITCH_TO_PRESET, payload: preset});
  }

}