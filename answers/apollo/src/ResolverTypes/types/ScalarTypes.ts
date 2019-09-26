import {GraphQLScalarType} from 'graphql';
import ExtractPropsWithType from './ExtractPropsWithType';
import MakePropsRequired from './MakePropsRequired';

/**
 * Extract the propeties from the resolvers config for configuring scalars
 * and mark them as required.
 */
type ScalarTypes<Resolvers> = MakePropsRequired<ExtractPropsWithType<Resolvers, GraphQLScalarType>>;
export default ScalarTypes;
