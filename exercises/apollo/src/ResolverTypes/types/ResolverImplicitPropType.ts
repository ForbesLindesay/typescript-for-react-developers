import Resolver from './Resolver';
import KeyOf from './KeyOf';

/**
 * The type that the given resolver already has as a property
 */
type ResolverImplicitPropType<T, Key> = T extends Resolver<any, infer Parent>
  ? Key extends KeyOf<Parent>
    ? Parent[Key]
    : undefined
  : never;
export default ResolverImplicitPropType;
