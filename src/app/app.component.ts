import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { List } from 'immutable';
import { CHANGE_AMPLITUDE, CHANGE_MASTER_GAIN, START, STOP } from './harmonics';
import { AppState } from './app-state';
import { Partial } from './partial';

@Component({
  selector: 'hs-app',
  template: `
    <header>
      <button *ngIf="!(playing$ | async)" (click)="start()">Start</button>
      <button *ngIf="playing$ | async" (click)="stop()">Stop</button>
    </header>
    <div class="main">
      <hs-partial class="fundamental"
                  [strong]=true
                  [gain]="masterGain$ | async"
                  [curveData]="totalCurve$ | async"
                  (gainChange)="changeMasterGain($event)">
        Master
      </hs-partial>
      <div class="harmonics">
        <hs-partial *ngFor="let partial of partials$| async; let i = index; let evn = even; trackBy: trackPartial"
                    [class.even]="evn"
                    [gain]=partial.amplitude
                    [curveData]=partial.data
                    (gainChange)="changeAmplitude(i, $event)">
          <div class="freq">{{ roundFrequency(partial.frequency) }}Hz</div>
        </hs-partial>
      </div>
    </div>
  `,
  styles: [`
    header {
      position: fixed;
      top: 0;
      width: 100%;
      height: 30px;
      background-color: #333;
    }
    .main {
      position: fixed;
      top: 30px;
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
    .freq {
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

  changeMasterGain(gain: number) {
    this.store.dispatch({
      type: CHANGE_MASTER_GAIN,
      payload: gain
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

  roundFrequency(frequency: number) {
    return Number(frequency).toFixed(2);
  }

}