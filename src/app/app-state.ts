/*
 * Model definition for the (immutable) application state.
 */
import { TypedRecord, makeTypedFactory } from 'typed-immutable-record';
import { List } from 'immutable';
import { PartialRecord } from './partial';

// The TypeScript interface that defines the application state's properties.
// This is to be imported wherever a reference to the app state is used
// (reducers, components, services...) 
export interface AppState {
  playing: boolean, // Are we currently playing sounds?
  fundamentalFrequency: number, // The frequency (+pitch) of the fundamental partial
  partials: List<PartialRecord>, // The partials (fundamental + harmonics)
  masterGain: number // Master volume
}

// An Immutable.js Record implementation of the AppState interface.
// This only needs to be imported by reducers, since they produce new versions
// of the state. Components should only ever read the state, never change it,
// so they should only need the interface, not the record. 
export interface AppStateRecord extends TypedRecord<AppStateRecord>, AppState { }

// An Immutable.js record factory for the record.
export const appStateFactory = makeTypedFactory<AppState, AppStateRecord>({
  playing: false,
  fundamentalFrequency: 440,
  partials: <List<PartialRecord>>List.of(),
  masterGain: 1
});
