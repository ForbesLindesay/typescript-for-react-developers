import ResolverRequiredValueType from './types/ResolverRequiredValueType';
import ResolverImplicitPropType from './types/ResolverImplicitPropType';
import TypeFieldResolvers from './types/TypeFieldResolvers';
import KeyOf from './types/KeyOf';
import ScalarTypes from './types/ScalarTypes';

/**
 * Take a resolvers config where everything is optional, and mark things as
 * required if they are needed.
 */
type Resolvers<TResolvers> = TypeFieldResolvers<TResolvers> & ScalarTypes<TResolvers>;
export default Resolvers;

/**
 * Use this to figure out why a resolver you thought should be optional is marked as
 * as required.
 *
 * Example:
 *
 *     type X = DebugResolver<Resolvers['PageInfo'], 'startCursor'>;
 *
 * Hover over X and you will see something like:
 *
 *     type X = {
 *       requiredValue: Generated.Maybe<string>;
 *       implicitValue: string | null | undefined;
 *     }
 *
 * The requiredValue is the type defined in the GraphQL schema. The implicitValue is
 * the value in TypeScript. If the implicitValue is assignable to the requiredValue,
 * no resolver is required.
 */
export type DebugResolver<ObjectType, ResolverName extends KeyOf<Exclude<ObjectType, undefined>>> = {
  requiredValue: ResolverRequiredValueType<Exclude<ObjectType, undefined>[ResolverName]>;
  implicitValue: ResolverImplicitPropType<Exclude<ObjectType, undefined>[ResolverName], ResolverName>;
};
