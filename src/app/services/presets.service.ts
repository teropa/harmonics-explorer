/*
 * Service for applying certain preset waveforms to the harmonics.
 */
import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { List } from 'immutable';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect, mergeEffects } from '@ngrx/effects';

import { AppState } from '../app-state';
import { Partial } from '../partial';
import { CHANGE_AMPLITUDE, SWITCH_TO_PRESET } from '../harmonics';

// The waveforms that have presets for
export enum Preset {
  Sine,
  SawTooth,
  Square
}

// For each preset, a function that calculates the amplitude for
// each partial.
const AMPLITUDE_FUNCTIONS = {
  // In a pure sine wave we only play the fundamental frequency.
  [Preset.Sine]:     (index: number) => index === 0 ? 1 : 0,
  // In a sawtooth wave we play all frequencies with descending amplitudes.
  [Preset.SawTooth]: (index: number) => 1 / (index + 1),
  // In a square wave we only play odd harmonics with descending amplitudes.
  // (Here we check if the number is even, not odd, because 0 is the fundamental.)
  [Preset.Square]:   (index: number) => index % 2 === 0 ? 1 / (index + 1) : 0
};

// When a preset is applied, the time step interval by which the partials are changed
const INTERVAL = 300;

@Injectable()
export class PresetsService implements OnDestroy {
  subscription: Subscription; // Our subscription to @ngrx/effects

  constructor(private actions$: Actions, private store: Store<AppState>) {
    this.subscription = mergeEffects(this).subscribe(store);
  }

  // After a SWITCH_TO_PRESET action is dispatched, we will dispatch a number
  // of CHANGE_AMPLITUDE actions over time.
  @Effect() presetChanges$ = this.actions$
    .ofType(SWITCH_TO_PRESET)
    .withLatestFrom(this.store)
    .mergeMap(([action, state]) => this.switchTo(action.payload, state));

  private switchTo(preset: Preset, state: AppState): Observable<Action> {
    switch (preset) {
      // For each preset, get the collection of actions to be applied, and
      // make an Observable that emits them over time with a constant interval.
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
    // For base sine wave we apply the action in reverse, because
    // we're removing partials and not adding them. Results in a more
    // natural transition.
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
      // For each partial, make an action that changes its amplitude
      // to the one calculated for this preset.
      .map((partial, index) => ({
        type: CHANGE_AMPLITUDE,
        payload: {partial: index, amplitude: amplitudeFn(index)}
      }))
      // Remove no-op actions for the partials whose amplitudes would not change.
      .filter((action, index) =>
        partials.get(index).amplitude !== action.payload.amplitude);
  }

  // Unsubscribe from @ngrx/effects when we're destroyed.
  // The presence of this function will also cause Angular to eagerly
  // initialize this service, so that the subscriptions made in the
  // constructor are made when the application starts.
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}