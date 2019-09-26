import KeyOf from './KeyOf';
/**
 * Extracts props in Base which can be assigned a value of type Condition
 */
type ExtractPropsWithType<Base, Condition> = Pick<
  Base,
  {[Key in KeyOf<Base>]: Condition extends Base[Key] ? Key : never}[KeyOf<Base>]
>;
export default ExtractPropsWithType;
