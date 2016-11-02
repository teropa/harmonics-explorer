/*
 * The main (and only) @ngrx/store reducer for the application.
 * 
 * This implements the application's core logic by handling actions
 * and producing new versions of the immutable AppState record
 * based on those actions.
 */
import { ActionReducer, Action } from '@ngrx/store';
import { List, Range } from 'immutable';
import { AppStateRecord, appStateFactory } from './app-state';
import { PartialRecord, partialFactory } from './partial';
import { calculateSineCurve, combineCurves } from './curves';

// Action definitions
export const START = 'START'; // start sound ("unmute")
export const STOP = 'STOP'; // stop sound ("mute")
export const CHANGE_FUNDAMENTAL_FREQUENCY = 'CHANGE_FUNDAMENTAL_FREQUENCY';
export const CHANGE_AMPLITUDE = 'CHANGE_AMPLITUDE';
export const CHANGE_MASTER_GAIN = 'CHANGE_TOTAL_GAIN';
export const SWITCH_TO_PRESET = 'SWITCH_TO_PRESET'; // shortcuts "square", "sawtooth", "pure sine"

// How many harmonic partials to include.
const HARMONICS_COUNT = 13;

// The reducer function. Receives actions and produces new application states.
export const harmonicsReducer: ActionReducer<AppStateRecord> =
    (state = makeInitialState(), action: Action) => {
  switch (action.type) {
    case START:
      return setPlayState(state, true);
    case STOP:
      return setPlayState(state, false);
    case CHANGE_AMPLITUDE:
      return changeAmplitude(
        state,
        action.payload.partial,
        action.payload.amplitude
      );
    case CHANGE_MASTER_GAIN: 
      return changeMasterGain(state, action.payload);
    case CHANGE_FUNDAMENTAL_FREQUENCY:
      return changeFundamentalFrequency(state, action.payload);
    default:
      return state;
  }
}

// Initial AppState, used to bootstrap the reducer.
function makeInitialState() {
  const fundamentalFrequency = 261.63;
  const partials = <List<PartialRecord>>List(Range(1, HARMONICS_COUNT + 1)
    .map(partialNumber => makePartial(fundamentalFrequency, partialNumber)));
  return appStateFactory({
    playing: false,
    masterGain: 0.5,
    fundamentalFrequency,
    partials
  });
}

// Initial Partials, invoked for each harmonic from makeInitialState
function makePartial(fundamentalFrequency: number, partial: number) {
  return partialFactory({
    frequency: fundamentalFrequency * partial, // Each harmonic is an integer multiple of the fundamental frequency.
    amplitude: partial === 1 ? 1 : 0 // Only the fundamental is on by default.
  });
}

// Start (unmute) / Stop (mute)
function setPlayState(state: AppStateRecord, playing: boolean) {
  return state.merge({playing});
}

// Change the amplitude for a particular partial.
function changeAmplitude(state: AppStateRecord, partialNumber: number, amplitude: number) {
  return state.updateIn(
    ['partials', partialNumber], // Deep update inside a specific item of the partials list
    p => changeAmplitudeForPartial(p, amplitude)
  );
}

// Adjust the amplitude for a particular partial and also
// calculate the changed sine curve for it.
function changeAmplitudeForPartial(partial: PartialRecord, amplitude: number) {
  return partial.merge({amplitude});
}

// Change the fundamental frequency of the system. Will cause all partials
// to be updated as well.
function changeFundamentalFrequency(state: AppStateRecord, fundamentalFrequency: number) {
  return state
    .merge({fundamentalFrequency})
    .update('partials',
      partials => setPartialFrequencies(partials, fundamentalFrequency)); 
}


// When the fundamental frequency has changed, recalculate the frequencies
// for all the partials and update their curves accordingly.
function setPartialFrequencies(partials: List<PartialRecord>, fundamentalFrequency: number) {
  return partials.map((partial: PartialRecord, index: number) => {
    const frequency = fundamentalFrequency * (index + 1);
    return partial.merge({frequency});
  });
}


// Change the master gain of the total curve. Will also recalculate it.
function changeMasterGain(state: AppStateRecord, masterGain: number) {
  return state.merge({masterGain});
}

