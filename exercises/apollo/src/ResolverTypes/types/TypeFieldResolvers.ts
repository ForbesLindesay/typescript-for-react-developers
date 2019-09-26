import MakeOptionalWhenNoRequiredResolvers from './MakeOptionalWhenNoRequiredResolvers';
import MakeResolversRequiredForObjectTypes from './MakeResolversRequiredForObjectTypes';
import ExtractObjectResolverConfig from './ExtractObjectResolverConfig';

/**
 * Take the resolvers and extract just the object type resolvers, marking any
 * that are needed as required
 */
type TypeFieldResolvers<Resolvers> = MakeOptionalWhenNoRequiredResolvers<
  MakeResolversRequiredForObjectTypes<ExtractObjectResolverConfig<Resolvers>>
>;
export default TypeFieldResolvers;
