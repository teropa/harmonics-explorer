import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { List } from 'immutable';
import { Store } from '@ngrx/store';
import { Actions, Effect, mergeEffects } from '@ngrx/effects';

import { START, STOP, CHANGE_MASTER_GAIN } from './harmonics';
import { AppState } from './app-state';

@Injectable()
export class AudioService implements OnDestroy {
  subscription: Subscription;

  audioCtx = new AudioContext();
  masterGain = this.audioCtx.createGain();

  oscillatorBank: List<OscillatorNode>;

  constructor(private actions$: Actions, private store: Store<AppState>) { 
    this.subscription = mergeEffects(this).subscribe(store);
    this.masterGain.connect(this.audioCtx.destination);
  }

  @Effect({dispatch: false}) start$ = this.actions$
    .ofType(START)
    .withLatestFrom(this.store)
    .do(([action, state]) => this.start(state));
  @Effect({dispatch: false}) stop$ = this.actions$
    .ofType(STOP)
    .do(() => this.stop());
  @Effect({dispatch: false}) changeMasterGain$ = this.actions$
    .ofType(CHANGE_MASTER_GAIN)
    .withLatestFrom(this.store.select('masterGain'))
    .do(([action, gain]) => this.setMasterGain(<number>gain));

  private start(state: AppState) {
    this.oscillatorBank = <List<OscillatorNode>>state.partials.map(partial => {
      const oscillator = this.audioCtx.createOscillator();
      oscillator.frequency.value = partial.frequency;
      oscillator.connect(this.masterGain);
      oscillator.start();
      return oscillator;
    });
  }

  private stop() {
    this.oscillatorBank.forEach(osc => osc.stop());
    this.oscillatorBank = null;
  }

  private setMasterGain(gain: number) {
    this.masterGain.gain.value = gain;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}