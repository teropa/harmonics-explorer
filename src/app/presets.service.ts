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
        return Observable.from(this.sineActions(state.partials));
      case Preset.SawTooth:
        return Observable.from(this.sawtoothActions(state.partials));
      case Preset.Square:
        return Observable.from(this.squareActions(state.partials));
      default:
        return <Observable<Action>>Observable.empty();
    }
  }

  private sineActions(partials: List<Partial>) {
    return partials.toArray().map((partial, index) => ({
      type: CHANGE_AMPLITUDE,
      payload: {partial: index, amplitude: index === 0 ? 1 : 0}
    }));
  }

  private sawtoothActions(partials: List<Partial>) {
    return partials.toArray().map((partial, index) => ({
      type: CHANGE_AMPLITUDE,
      payload: {partial: index, amplitude: 1 / (index + 1)}
    }));
  }

  private squareActions(partials: List<Partial>) {
    return partials.toArray().map((partial, index) => ({
      type: CHANGE_AMPLITUDE,
      payload: {partial: index, amplitude: index % 2 === 0 ? 1 / (index + 1) : 0}
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}