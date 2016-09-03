import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { List } from 'immutable';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect, mergeEffects } from '@ngrx/effects';

import { AppState } from './app-state';
import { Partial } from './partial';
import { CHANGE_AMPLITUDE, SWITCH_TO_PRESET } from './harmonics';

export enum Preset {
  Sine,
  SawTooth,
  Square
}

const AMPLITUDE_FUNCTIONS = {
  [Preset.Sine]:     (index: number) => index === 0 ? 1 : 0,
  [Preset.SawTooth]: (index: number) => 1 / (index + 1),
  [Preset.Square]:   (index: number) => index % 2 === 0 ? 1 / (index + 1) : 0
};

const INTERVAL = 300;

@Injectable()
export class PresetsService implements OnDestroy {
  subscription: Subscription;

  constructor(private actions$: Actions, private store: Store<AppState>) {
    this.subscription = mergeEffects(this).subscribe(store);
  }

  @Effect() presetChanges$ = this.actions$
    .ofType(SWITCH_TO_PRESET)
    .withLatestFrom(this.store)
    .mergeMap(([action, state]) => this.switchTo(action.payload, state));

  private switchTo(preset: Preset, state: AppState): Observable<Action> {
    switch (preset) {
      case Preset.Sine:
        return Observable.from(this.sineActions(state.partials))
          .zip(Observable.interval(INTERVAL), (action, _) => action);
      case Preset.SawTooth:
        return Observable.from(this.sawtoothActions(state.partials))
          .zip(Observable.interval(INTERVAL), (action, _) => action);
      case Preset.Square:
        return Observable.from(this.squareActions(state.partials))
          .zip(Observable.interval(INTERVAL), (action, _) => action);
      default:
        return <Observable<Action>>Observable.empty();
    }
  }

  private sineActions(partials: List<Partial>) {
    return this.presetActions(partials, Preset.Sine).reverse();
  }

  private sawtoothActions(partials: List<Partial>) {
    return this.presetActions(partials, Preset.SawTooth);
  }

  private squareActions(partials: List<Partial>) {
    return this.presetActions(partials, Preset.Square);
  }

  private presetActions(partials: List<Partial>, preset: Preset) {
    const amplitudeFn = AMPLITUDE_FUNCTIONS[preset];
    return partials.toArray()
      .map((partial, index) => ({
        type: CHANGE_AMPLITUDE,
        payload: {partial: index, amplitude: amplitudeFn(index)}
      }))
      .filter((action, index) => partials.get(index).amplitude !== action.payload.amplitude);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}