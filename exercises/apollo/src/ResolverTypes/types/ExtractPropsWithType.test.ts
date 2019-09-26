import * as ta from 'type-assertions';
import ExtractPropsWithType from './ExtractPropsWithType';

ta.assert<
  ta.Equal<
    ExtractPropsWithType<
      {
        a?: string;
        b: number;
        c: string | undefined;
      } & {[key: string]: never},
      string
    >,
    {
      a?: string | undefined;
      c: string | undefined;
    }
  >
>();
