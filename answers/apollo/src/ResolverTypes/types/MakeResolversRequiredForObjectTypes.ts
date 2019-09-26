import ObjectResolversType from './ObjectResolversType';
import KeyOf from './KeyOf';

/**
 * Takes an object that looks like:
 *
 *    interface Resolvers {
 *      Query?: {thing?: ThingResolver}
 *      Thing?: {id?: IDResolver, data?: DataResolver}
 *      Data?: {id?: IDResolver, value?: ValueResolver}
 *    }
 *
 * And makes all fields that need resolvers have required resolvers
 */
type MakeResolversRequiredForObjectTypes<Resolvers> = {
  [Key in string & KeyOf<Resolvers>]: ObjectResolversType<Exclude<Resolvers[Key], undefined>>;
};

export default MakeResolversRequiredForObjectTypes;
