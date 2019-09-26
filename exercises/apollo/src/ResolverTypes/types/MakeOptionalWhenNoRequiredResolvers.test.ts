import * as ta from 'type-assertions';
import MakeOptionalWhenNoRequiredResolvers from './MakeOptionalWhenNoRequiredResolvers';

ta.assert<
  ta.Equal<
    MakeOptionalWhenNoRequiredResolvers<{
      x: {};
      y: {a: true};
    }>,
    {
      x?: {};
      y: {a: true};
    }
  >
>();
