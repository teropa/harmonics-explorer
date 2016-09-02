import { ActionReducer, Action } from '@ngrx/store';
import { AppStateRecord, appStateFactory } from './app-state';
import { PartialRecord, partialFactory } from './partial';
import { List, Range } from 'immutable';

export const START = 'START';
export const STOP = 'STOP';
export const CHANGE_AMPLITUDE = 'CHANGE_AMPLITUDE';
export const CHANGE_TOTAL_GAIN = 'CHANGE_TOTAL_GAIN';

const SAMPLE_COUNT = 650;
const SAMPLE_RATE = 44100;

function makePartial(fundamentalFrequency: number, partial: number) {
  return partialFactory({
    frequency: fundamentalFrequency * partial,
    amplitude: 1 / partial
  });
}

function makeInitialState() {
  return calculateTotalCurve(appStateFactory({
    playing: false,
    gain: 1,
    fundamentalFrequency: 440,
    partials: <List<PartialRecord>>List(Range(1, 8).map(partial => calculateCurve(makePartial(440, partial))))
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
    .map(s => calculateTotalSample(state.partials, s, state.gain));
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

function changeTotalGain(state: AppStateRecord, gain: number) {
  return calculateTotalCurve(state.set('gain', gain));
}

export const harmonicsReducer: ActionReducer<AppStateRecord> = (state = makeInitialState(), action: Action ) => {
  switch (action.type) {
    case START:
      return setPlayState(state, true);
    case STOP:
      return setPlayState(state, false);
    case CHANGE_AMPLITUDE:
      return changeAmplitude(state, action.payload.partial, action.payload.amplitude);
    case CHANGE_TOTAL_GAIN: 
      return changeTotalGain(state, action.payload);
    default:
      return state;
  }
}