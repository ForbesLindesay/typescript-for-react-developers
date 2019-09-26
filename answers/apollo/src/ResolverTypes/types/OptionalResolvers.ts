import RequiredResolvers from './RequiredResolvers';
import KeyOf from './KeyOf';

/**
 * Inverse of RequiredResolvers
 */
type OptionalResolvers<T> = Exclude<KeyOf<T>, RequiredResolvers<T>>;

export default OptionalResolvers;
