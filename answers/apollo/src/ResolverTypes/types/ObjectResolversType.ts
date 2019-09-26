import MakePropsRequired from './MakePropsRequired';
import RequiredResolvers from './RequiredResolvers';
import OptionalResolvers from './OptionalResolvers';

/**
 * For a given Type, make resolvers required wherever there is a type mis-match/missing property
 * between GraphQL and TypeScript
 */
type ObjectResolversType<T> = MakePropsRequired<Pick<T, RequiredResolvers<T>>> & Pick<T, OptionalResolvers<T>>;
export default ObjectResolversType;
