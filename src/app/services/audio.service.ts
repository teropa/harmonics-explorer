/*
 * A service for playing the harmonics through the Web Audio API.
 */
import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { List } from 'immutable';
import { Store } from '@ngrx/store';
import { Actions, Effect, mergeEffects } from '@ngrx/effects';

import {
  START,
  STOP,
  CHANGE_MASTER_GAIN,
  CHANGE_FUNDAMENTAL_FREQUENCY,
  CHANGE_AMPLITUDE
} from '../harmonics.reducer';
import { AppState } from '../app-state';
import { Partial } from '../partial';

interface OscillatorBankItem {
  oscillator: OscillatorNode;
  gain: GainNode;
}

@Injectable()
export class AudioService implements OnDestroy {
  subscription: Subscription; // Our subscription(s) to @ngrx/effects

  audioCtx = new AudioContext(); // Web Audio AudioContext
  masterGain = this.audioCtx.createGain(); // Master GainNode

  // Currently playing oscillators for each harmonic
  oscillatorBank: List<OscillatorBankItem>;

  constructor(private actions$: Actions, private store: Store<AppState>) { 
    this.subscription = mergeEffects(this).subscribe(store);
    this.masterGain.connect(this.audioCtx.destination);
  }

  // We listen to actions dispatched to @ngrx/store through @ngrx/effects,
  // and act accordingly. For each @Effect in this service we use {dispatch: false}
  // because we're never dispatching any further actions to the store. This service
  // is purely for side effects (= playing sounds)

  // Start & Stop
  @Effect({dispatch: false}) start$ = this.actions$
    .ofType(START)
    .withLatestFrom(this.store)
    .do(([action, state]) => this.start(state));
  @Effect({dispatch: false}) stop$ = this.actions$
    .ofType(STOP)
    .withLatestFrom(this.store)
    .do(([action, state]) => this.stop(state));

  // Master gain changed
  @Effect({dispatch: false}) changeMasterGain$ = this.actions$
    .ofType(CHANGE_MASTER_GAIN)
    .withLatestFrom(this.store.select('masterGain'))
    .do(([action, gain]) => this.setMasterGain(<number>gain));

  // Partial amplitude changed
  @Effect({dispatch: false}) changeAmplitude$ = this.actions$
    .ofType(CHANGE_AMPLITUDE)
    .do(action => this.setGain(action.payload.partial, action.payload.amplitude));

  // Fundamental frequency changed
  @Effect({dispatch: false}) changeFundamentalFrequency$ = this.actions$
    .ofType(CHANGE_FUNDAMENTAL_FREQUENCY)
    .withLatestFrom(this.store.select('partials'))
    .do(([action, partials]) => this.setFrequencies(<List<Partial>>partials));

  private start(state: AppState) {
    // Ramp master volume up over 30ms.
    // (Using ramp to prevent "pops", http://teropa.info/blog/2016/08/30/amplitude-and-loudness.html)
    this.masterGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(state.masterGain, this.audioCtx.currentTime + 0.03);

    // For each partial, create an oscillator+gain combo
    this.oscillatorBank = <List<OscillatorBankItem>>state.partials.map(partial => {
      const oscillator = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Audible frequency and amplitude come directly from the partials
      oscillator.frequency.value = partial.frequency;
      gain.gain.value = partial.amplitude;

      oscillator.connect(gain);
      gain.connect(this.masterGain);

      // Start playing immediately
      oscillator.start();

      return {oscillator, gain};
    });
  }

  private stop(state: AppState) {
    // Ramp master volume down over a 30ms ramp
    this.masterGain.gain.setValueAtTime(state.masterGain, this.audioCtx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.03);

    // Stop oscillators after 30ms
    this.oscillatorBank.forEach(item => item.oscillator.stop(this.audioCtx.currentTime + 0.03));
    this.oscillatorBank = null;
  }

  // Adjust master volume.
  private setMasterGain(gain: number) {
    this.masterGain.gain.setValueAtTime(gain, this.audioCtx.currentTime);
  }

  // Adjust volume (amplitude) of a particular partial.
  // Only effective when currently playing.
  private setGain(partial: number, gain: number) {
    if (this.oscillatorBank) {
      this.oscillatorBank.get(partial).gain.gain.value = gain;
    }
  }

  // Update partial frequencies. Only effective when currently playing.
  private setFrequencies(partials: List<Partial>){
    if (this.oscillatorBank) {
      partials.forEach((p, idx) => {
        const osc = this.oscillatorBank.get(idx).oscillator;
        osc.frequency.value = p.frequency;
      });
    }  
  }

  // Unsubscribe from @ngrx/effects when destroyed, and also destroy
  // the Web Audio AudioContext.
  // This happens when the app is destroyed during hot reload.
  // The presence of this function will also cause Angular to eagerly
  // initialize this service, so that the subscriptions made in the
  // constructor are made when the application starts.
  ngOnDestroy() {
    this.subscription.unsubscribe();
    (<any>this.audioCtx).close();
  }

}