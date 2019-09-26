type RemoveNever<T> = T extends infer S & {[key: string]: never} ? S : T;
type KeyOf<T> = keyof T & keyof RemoveNever<T>;
export default KeyOf;
