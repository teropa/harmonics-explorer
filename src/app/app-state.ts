import { TypedRecord, makeTypedFactory } from 'typed-immutable-record';
import { List } from 'immutable';
import { PartialRecord } from './Partial';

export interface AppState {
  partials: List<PartialRecord>,
  gain: number,
  totalCurve?: List<number>
}

export interface AppStateRecord extends TypedRecord<AppStateRecord>, AppState { }

export const appStateFactory = makeTypedFactory<AppState, AppStateRecord>({
  partials: <List<PartialRecord>>List.of(),
  gain: 1,
  totalCurve: <List<number>>List.of()
});
