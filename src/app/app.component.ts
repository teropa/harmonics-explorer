import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { List } from 'immutable';
import { CHANGE_AMPLITUDE, CHANGE_MASTER_GAIN, START, STOP } from './harmonics';
import { AppState } from './app-state';
import { Partial } from './partial';

@Component({
  selector: 'hs-app',
  template: `
    <button *ngIf="!(playing$ | async)" (click)="start()">Start</button>
    <button *ngIf="playing$ | async" (click)="stop()">Stop</button>
    <div>
      Gain
      <input #masterGainInput
          type="range"
          [value]="masterGain$ | async"
          (input)="changeMasterGain()"
          min="0"
          max="1"
          step="0.1">
      <hs-curve [data]="totalCurve$ | async"></hs-curve>
    </div>
    <hs-partial *ngFor="let partial of partials$| async; let i = index; trackBy: trackPartial"
                [partial]=partial
                (amplitudeChange)="changeAmplitude(i, $event)">
    </hs-partial>
  `
})
export class AppComponent {
  partials$: Observable<List<Partial>>;
  totalCurve$: Observable<List<number>>;
  masterGain$: Observable<number>;
  playing$: Observable<boolean>;
  @ViewChild('masterGainInput') masterGainInput: ElementRef;

  constructor(private store: Store<AppState>) {
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

  changeMasterGain() {
    this.store.dispatch({
      type: CHANGE_MASTER_GAIN,
      payload: parseFloat(this.masterGainInput.nativeElement.value)
    });
  }

  start() {
    this.store.dispatch({type: START});
  }

  stop() {
    this.store.dispatch({type: STOP});
  }

  trackPartial(index: number) { 
    return index;
  }

}