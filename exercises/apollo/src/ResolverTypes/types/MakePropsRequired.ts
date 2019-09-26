import KeyOf from './KeyOf';

/**
 * Make all properties of T required
 */
type MakePropsRequired<T> = {[K in string & KeyOf<T>]: Exclude<T[K], undefined>};
export default MakePropsRequired;
