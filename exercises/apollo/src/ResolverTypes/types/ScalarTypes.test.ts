import * as ta from 'type-assertions';
import {GraphQLScalarType} from 'graphql';
import ScalarTypes from './ScalarTypes';

ta.assert<
  ta.Equal<
    ScalarTypes<{
      foo?: string;
      bar?: number;
      baz?: GraphQLScalarType;
    }>,
    {
      baz: GraphQLScalarType;
    }
  >
>();
