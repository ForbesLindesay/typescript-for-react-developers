import Resolver from './Resolver';

/**
 * The type that the schema says is returned by a given resolver
 */
type ResolverRequiredValueType<T> = T extends Resolver<infer S, any> ? S : never;
export default ResolverRequiredValueType;
