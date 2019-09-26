import SerializeObjectType from './SerializeObjectType';

/**
 * Returns `true` if `From` will be autmatically coerced into `To` by GraphQL.
 *
 * This only handles the `.valueOf()` coercion. It does not support number -> boolean, number -> string etc.
 * as thse coercions often indicate mistakes/programmer error. Since it's just the type system, this
 * will not ever affect runtime behavior.
 */
type IsGraphAssignable<From, To> = Normalize<
  From extends To
    ? true
    : To extends string | number | null | undefined
    ? SerializeObjectType<From> extends To
      ? true
      : false
    : false
>;

/**
 * convert all types that are not `true` to `false`
 */
type Normalize<A extends boolean> = (A extends never ? false : A extends true ? never : false) extends never
  ? true
  : false;

export default IsGraphAssignable;
