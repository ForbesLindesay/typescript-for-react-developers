import * as ta from 'type-assertions';
import TypeFieldResolvers from './TypeFieldResolvers';

type Object = {
  foo?: (
    parent: {foo: string; baz: string | null},
    args: {y: string},
    context: {z: string},
    info: {a: string},
  ) => Promise<string> | string;
  bar?: (
    parent: {foo: string; baz: string | null},
    args: {y: string},
    context: {z: string},
    info: {a: string},
  ) => Promise<string> | string;
  baz?: (
    parent: {foo: string; baz: string | null},
    args: {y: string},
    context: {z: string},
    info: {a: string},
  ) => Promise<string> | string;
};

ta.assert<
  ta.Equal<
    TypeFieldResolvers<{Query?: Object; foo: string}>,
    {
      Query: {
        foo?: (
          parent: {foo: string; baz: string | null},
          args: {y: string},
          context: {z: string},
          info: {a: string},
        ) => Promise<string> | string;
        bar: (
          parent: {foo: string; baz: string | null},
          args: {y: string},
          context: {z: string},
          info: {a: string},
        ) => Promise<string> | string;
        baz: (
          parent: {foo: string; baz: string | null},
          args: {y: string},
          context: {z: string},
          info: {a: string},
        ) => Promise<string> | string;
      };
    }
  >
>();
