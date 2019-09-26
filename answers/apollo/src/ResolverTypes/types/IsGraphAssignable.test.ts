import * as ta from 'type-assertions';
import IsGraphAssignable from './IsGraphAssignable';

ta.assert<IsGraphAssignable<string, string>>();
ta.assert<IsGraphAssignable<string, string | null>>();
ta.assert<IsGraphAssignable<Date, number>>();

ta.assert<ta.Not<IsGraphAssignable<Date, string>>>();
ta.assert<ta.Not<IsGraphAssignable<string | null, string>>>();
