import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { Actions, Effect, mergeEffects } from '@ngrx/effects';

import { START, STOP, CHANGE_MASTER_GAIN } from './harmonics';
import { AppState } from './app-state';

@Injectable()
export class AudioService implements OnDestroy {
  subscription: Subscription;

  audioCtx = new AudioContext();
  masterGain = this.audioCtx.createGain();

  oscillatorBank: OscillatorNode[];

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
    this.oscillatorBank = [this.audioCtx.createOscillator()];
    this.oscillatorBank[0].frequency.value = state.fundamentalFrequency;
    this.oscillatorBank[0].connect(this.masterGain);
    this.oscillatorBank[0].start();
  }

  private stop() {
    this.oscillatorBank[0].stop();
  }

  private setMasterGain(gain: number) {
    this.masterGain.gain.value = gain;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}