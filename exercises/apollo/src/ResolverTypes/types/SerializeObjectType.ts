/**
 * GraphQL automatically calls `valueOf` and `toJSON` when serializing
 * to strings.
 */
type SerializeObjectType<T> = T extends {valueOf: () => infer S} ? S : T extends {toJSON: () => infer S} ? S : T;
export default SerializeObjectType;
