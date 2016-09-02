import { TypedRecord, makeTypedFactory } from 'typed-immutable-record';
import { List } from 'immutable';

export interface Partial {
  frequency: number;
  amplitude: number;
  data?: List<number>
}

export interface PartialRecord extends TypedRecord<PartialRecord>, Partial { }

export const partialFactory = makeTypedFactory<Partial, PartialRecord>({
  frequency: 440,
  amplitude: 1,
  data: <List<number>>List.of()
});
