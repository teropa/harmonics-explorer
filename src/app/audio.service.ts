import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { Actions, Effect, mergeEffects } from '@ngrx/effects';

import { START, STOP } from './harmonics';
import { AppState } from './app-state';

@Injectable()
export class AudioService implements OnDestroy {
  subscription: Subscription;

  audioCtx = new AudioContext();
  oscillatorBank: OscillatorNode[];

  constructor(private actions$: Actions, store: Store<AppState>) { 
    this.subscription = mergeEffects(this).subscribe(store);
  }

  @Effect({dispatch: false}) start$ = this.actions$
    .ofType(START)
    .do(() => this.start());
  @Effect({dispatch: false}) stop$ = this.actions$
    .ofType(STOP)
    .do(() => this.stop());

  private start() {
    this.oscillatorBank = [this.audioCtx.createOscillator()];
    this.oscillatorBank[0].frequency.value = 440;
    this.oscillatorBank[0].connect(this.audioCtx.destination);
    this.oscillatorBank[0].start();
  }

  private stop() {
    this.oscillatorBank[0].stop();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}