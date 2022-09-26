import * as t from 'funtypes';

import {GraphQlScalarResolvers} from '../../__generated__/types';
import createScalars from './createScalars';

const ScalarResolvers: GraphQlScalarResolvers = createScalars(
  {
    TrimmedString: t.String.withParser({
      name: `TrimmedString`,
      parse(value) {
        return {success: true, value: value.trim()};
      },
      serialize(value) {
        if (value === value.trim()) return {success: true, value};
        else return {success: false, message: `Expected string with no leading or trailing whitespace`};
      },
      test: t.String.withConstraint((value) =>
        value === value.trim() ? true : `Expected string with no leading or trailing whitespace`,
      ),
    }),
  },
  {TrimmedString: `A string that will always be stripped of leading and trailing whitespace`},
);

export default ScalarResolvers;
