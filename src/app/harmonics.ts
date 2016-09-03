import { ActionReducer, Action } from '@ngrx/store';
import { AppStateRecord, appStateFactory } from './app-state';
import { PartialRecord, partialFactory } from './partial';
import { List, Range } from 'immutable';

export const START = 'START';
export const STOP = 'STOP';
export const CHANGE_AMPLITUDE = 'CHANGE_AMPLITUDE';
export const CHANGE_MASTER_GAIN = 'CHANGE_TOTAL_GAIN';

const HARMONICS_COUNT = 13;
const SAMPLE_COUNT = 650;
const SAMPLE_RATE = 44100;

function makePartial(fundamentalFrequency: number, partial: number) {
  return partialFactory({
    frequency: fundamentalFrequency * partial,
    amplitude: partial === 1 ? 1 : 0
  });
}

function makeInitialState() {
  return calculateTotalCurve(appStateFactory({
    playing: true,
    masterGain: 0.5,
    fundamentalFrequency: 261.63,
    partials: <List<PartialRecord>>List(Range(1, HARMONICS_COUNT + 1).map(partial => calculateCurve(makePartial(261.63, partial))))
  }));
}

function calculateCurve(partial: PartialRecord) {
  return partial.set('data', Range(0, SAMPLE_COUNT).map(sample => calculateSample(partial, sample)));
}

function calculateSample(partial: PartialRecord, sample: number) {
  const angularFrequency = partial.frequency * 2 * Math.PI;
  const sampleTime = sample / SAMPLE_RATE;
  const sampleAngle = sampleTime * angularFrequency;
  return partial.amplitude * Math.sin(sampleAngle);
}



function changeAmplitudeForPartial(partial: PartialRecord, amplitude: number) {
  return calculateCurve(partial.set('amplitude', amplitude));
}

function calculateTotalCurve(state: AppStateRecord) {
  const totalCurve = Range(0, SAMPLE_COUNT)
    .map(s => calculateTotalSample(state.partials, s, state.masterGain));
  return state.set('totalCurve', totalCurve);
}

function calculateTotalSample(partials: List<PartialRecord>, sampleIndex: number, gain: number) {
  const sum = partials
    .map(p => p.data.get(sampleIndex))
    .reduce((sum, s) => sum + s, 0);
  const sample = sum * gain;
  return Math.min(1, Math.max(-1, sample));
}

function setPlayState(state: AppStateRecord, playing: boolean) {
  return state.set('playing', playing);
}

function changeAmplitude(state: AppStateRecord, partial: number, amplitude: number) {
  return calculateTotalCurve(state.updateIn(['partials', partial], p => changeAmplitudeForPartial(p, amplitude)));
}

function changeMasterGain(state: AppStateRecord, gain: number) {
  return calculateTotalCurve(state.set('masterGain', gain));
}

export const harmonicsReducer: ActionReducer<AppStateRecord> = (state = makeInitialState(), action: Action ) => {
  switch (action.type) {
    case START:
      return setPlayState(state, true);
    case STOP:
      return setPlayState(state, false);
    case CHANGE_AMPLITUDE:
      return changeAmplitude(state, action.payload.partial, action.payload.amplitude);
    case CHANGE_MASTER_GAIN: 
      return changeMasterGain(state, action.payload);
    default:
      return state;
  }
}