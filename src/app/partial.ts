/*
 * Model definition for the (immutable) state of a harmonic partial.
 */
import { TypedRecord, makeTypedFactory } from 'typed-immutable-record';
import { List } from 'immutable';

// The TypeScript interface that defines the partial's properties.
// This is to be imported wherever a reference to a partial is used
// (reducers, components, services...) 
export interface Partial {
  frequency: number; // The (calculated) frequency of the partial
  amplitude: number; // The (user defined) amplitude of the partial
  data?: List<number> // The sine curve data of the partial, for visualization
}

// An Immutable.js Record implementation of the Partial interface.
// This only needs to be imported by reducers, since they produce new versions
// of the state. Components should only ever read the state, never change it,
// so they should only need the interface, not the record. 
export interface PartialRecord extends TypedRecord<PartialRecord>, Partial { }

// An Immutable.js record factory for the record.
export const partialFactory = makeTypedFactory<Partial, PartialRecord>({
  frequency: 440,
  amplitude: 1,
  data: <List<number>>List.of()
});
