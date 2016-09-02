import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { List } from 'immutable';
import { CHANGE_AMPLITUDE } from './harmonics';
import { AppState } from './app-state';
import { Partial } from './partial';

@Component({
  selector: 'hs-app',
  template: `
    <hs-curve [data]="totalCurve$ | async"></hs-curve>
    <hs-partial *ngFor="let partial of partials$| async; let i = index; trackBy: trackPartial"
                [partial]=partial
                (amplitudeChange)="changeAmplitude(i, $event)">
    </hs-partial>
  `
})
export class AppComponent {
  partials$: Observable<List<Partial>>;
  totalCurve$: Observable<List<number>>;

  constructor(private store: Store<AppState>) {
    this.partials$ = <Observable<List<Partial>>>store.select('partials');
    this.totalCurve$ = <Observable<List<number>>>store.select('totalCurve');
  }

  changeAmplitude(partial: number, amplitude: number) {
    this.store.dispatch({type: CHANGE_AMPLITUDE, payload: {partial, amplitude}})
  }

  trackPartial(index: number) { 
    return index;
  }

}