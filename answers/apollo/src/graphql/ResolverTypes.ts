import ApolloResolverTypes from '../ResolverTypes'; // in a real project this is `from '@threads/apollo-resolver-types';`
import * as GeneratedTypes from './__generated__/types';

type ResolverTypes = ApolloResolverTypes<GeneratedTypes.Resolvers>;

export default ResolverTypes;
