import {makeExecutableSchema} from '@graphql-tools/schema';

import typeDefs from './__generated__/schema';
import {InterfaceTypeResolvers, UnionTypeResolvers} from './__generated__/types';
import resolvers from './resolvers';
import ScalarResolvers from './resolvers/Scalars';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    ...InterfaceTypeResolvers,
    ...UnionTypeResolvers,
    ...ScalarResolvers,
    ...resolvers,
  } as any,
});

export default schema;
