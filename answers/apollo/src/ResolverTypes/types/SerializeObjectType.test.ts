import * as ta from 'type-assertions';
import SerializeObjectType from './SerializeObjectType';

ta.assert<ta.Equal<SerializeObjectType<string>, string>>();
ta.assert<ta.Equal<SerializeObjectType<Date>, number>>();
