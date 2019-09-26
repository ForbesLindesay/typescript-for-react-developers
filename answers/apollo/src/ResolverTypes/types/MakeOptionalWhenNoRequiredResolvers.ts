import KeyOf from './KeyOf';

/**
 * Takes an object that looks like:
 *
 *    interface Resolvers {
 *      Query: {thing: ThingResolver}
 *      Thing: {id?: IDResolver, data: DataResolver}
 *      Data: {id?: IDResolver, value?: ValueResolver}
 *    }
 *
 * And makes the `Data` property optional as all the child properties are optional.
 */
type MakeOptionalWhenNoRequiredResolvers<Base> = Pick<
  Base,
  {[Key in KeyOf<Base>]: {} extends Base[Key] ? never : Key}[KeyOf<Base>]
> &
  Partial<Base>;
export default MakeOptionalWhenNoRequiredResolvers;
