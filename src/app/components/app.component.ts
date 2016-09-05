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
} from '../harmonics';
import { AppState } from '../app-state';
import { Partial } from '../partial';
import { NoteService } from '../note.service';
import { Preset } from '../presets.service';

@Component({
  selector: 'hs-app',
  template: `
    <hs-main-menu [playing]="playing$ | async"
                  (start)="start()"
                  (stop)="stop()"
                  (switchToPreset)="switchToPreset($event)"
                  [fundamentalFrequency]="(partials$ | async).first().frequency"
                  (fundamentalFrequencyChange)="changeFundamentalFrequency($event)">
    </hs-main-menu>
    <div class="main">
      <hs-partial class="fundamental"
                  [strong]=true
                  [gain]="masterGain$ | async"
                  [curveData]="totalCurve$ | async"
                  (gainChange)="changeMasterGain($event)">
        <div class="partial-label">Master</div>
      </hs-partial>
      <div class="harmonics">
        <hs-partial *ngFor="let partial of partials$| async; let i = index; let evn = even; trackBy: trackPartial"
                    [class.even]="evn"
                    [gain]=partial.amplitude
                    [curveData]=partial.data
                    (gainChange)="changeAmplitude(i, $event)">
          <div class="partial-label">{{ roundFrequency(partial.frequency) }}Hz</div>
        </hs-partial>
      </div>
    </div>
  `,
  styles: [`
    .main {
      position: fixed;
      top: 50px;
      bottom: 0;
      width: 100%;
    }
    .fundamental {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100px;
    }
    .harmonics {
      position: absolute;
      top: 100px;
      bottom: 0;
      width: 100%;

      display: flex;
      flex-direction: column;
    }
    .harmonics hs-partial {
      flex: 1 1 0;
      font-size: 0.8rem;
    }
    .harmonics hs-partial.even {
      background-color: #f6f6f6;
      border-top: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
    }
    .partial-label {
      text-align: right;
      padding-right: 1em;
    }
  `]
})
export class AppComponent {
  partials$: Observable<List<Partial>>;
  totalCurve$: Observable<List<number>>;
  masterGain$: Observable<number>;
  playing$: Observable<boolean>;

  constructor(private store: Store<AppState>, private notes: NoteService) {
    this.partials$ = <Observable<List<Partial>>>store.select('partials');
    this.totalCurve$ = <Observable<List<number>>>store.select('totalCurve');
    this.masterGain$ = <Observable<number>>store.select('masterGain');
    this.playing$ = <Observable<boolean>>store.select('playing');
  }

  changeAmplitude(partial: number, amplitude: number) {
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

  trackPartial(index: number) { 
    return index;
  }

  roundFrequency(frequency: number) {
    return Number(frequency).toFixed(2);
  }

}