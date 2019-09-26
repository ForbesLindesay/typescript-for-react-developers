import {GraphQLScalarType} from 'graphql';
import {GooglePerson} from '../types/scalars';

function validate(value: any): GooglePerson {
  if (value == null || typeof value !== 'object') {
    throw new Error('Expected GooglePerson to be an object');
  }
  if (typeof value.name !== 'string') {
    throw new Error('Expected GooglePerson.name to be an string');
  }
  if (typeof value.whatever !== 'number') {
    throw new Error('Expected GooglePerson.whatever to be a number');
  }
  return value;
}

export default new GraphQLScalarType({
  name: 'GooglePerson',
  serialize(value: GooglePerson | null | undefined): GooglePerson | null | undefined {
    if (value == null) return null;
    return validate(value);
  },
  parseValue(value?: unknown): GooglePerson | null | undefined {
    // tslint:disable-next-line:strict-type-predicates - tslint doesn't seem to understand unknown properly
    if (value == null) return null;
    return validate(value);
  },
  parseLiteral() {
    throw new Error('Not Implemented');
  },
});
