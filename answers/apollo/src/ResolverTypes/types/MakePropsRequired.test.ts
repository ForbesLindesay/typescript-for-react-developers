import * as ta from 'type-assertions';
import MakePropsRequired from './MakePropsRequired';

ta.assert<
  ta.Equal<
    MakePropsRequired<{
      a?: number;
      b: number;
      c: number | undefined;
    }>,
    {
      a: number;
      b: number;
      c: number;
    }
  >
>();
