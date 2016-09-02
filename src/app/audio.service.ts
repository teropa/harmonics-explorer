import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { List } from 'immutable';
import { Store } from '@ngrx/store';
import { Actions, Effect, mergeEffects } from '@ngrx/effects';

import { START, STOP, CHANGE_MASTER_GAIN, CHANGE_AMPLITUDE } from './harmonics';
import { AppState } from './app-state';

interface OscillatorBankItem {
  oscillator: OscillatorNode;
  gain: GainNode;
}

@Injectable()
export class AudioService implements OnDestroy {
  subscription: Subscription;

  audioCtx = new AudioContext();
  masterGain = this.audioCtx.createGain();

  oscillatorBank: List<OscillatorBankItem>;

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
    .withLatestFrom(this.store)
    .do(([action, state]) => this.stop(state));
  @Effect({dispatch: false}) changeMasterGain$ = this.actions$
    .ofType(CHANGE_MASTER_GAIN)
    .withLatestFrom(this.store.select('masterGain'))
    .do(([action, gain]) => this.setMasterGain(<number>gain));
  @Effect({dispatch: false}) changeAmplitude$ = this.actions$
    .ofType(CHANGE_AMPLITUDE)
    .do(action => this.setGain(action.payload.partial, action.payload.amplitude));

  private start(state: AppState) {
    this.masterGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(state.masterGain, this.audioCtx.currentTime + 0.03);
    this.oscillatorBank = <List<OscillatorBankItem>>state.partials.map(partial => {
      const oscillator = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      oscillator.frequency.value = partial.frequency;
      gain.gain.value = partial.amplitude;

      oscillator.connect(gain);
      gain.connect(this.masterGain);

      oscillator.start();

      return {oscillator, gain};
    });
  }

  private stop(state: AppState) {
    this.masterGain.gain.setValueAtTime(state.masterGain, this.audioCtx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.03);
    this.oscillatorBank.forEach(item => item.oscillator.stop(this.audioCtx.currentTime + 0.03));
    this.oscillatorBank = null;
  }

  private setMasterGain(gain: number) {
    this.masterGain.gain.setValueAtTime(gain, this.audioCtx.currentTime);
  }

  private setGain(partial: number, gain: number) {
    if (this.oscillatorBank) {
      this.oscillatorBank.get(partial).gain.gain.value = gain;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}