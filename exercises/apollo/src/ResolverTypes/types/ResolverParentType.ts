import Resolver from './Resolver';

/**
 * The type that is passed into a resolver as the Parent
 */
type ResolverParentType<T> = T extends Resolver<any, infer Parent> ? Parent : never;
export default ResolverParentType;
