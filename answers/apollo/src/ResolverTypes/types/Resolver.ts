/**
 * The type of a resolver for a field. Used to infer the field type
 */

export type ResolverFn<TResult, TParent> = (
  parent: TParent,
  args: any,
  context: any,
  info: any,
) => Promise<TResult> | TResult;

export type StitchingResolver<TResult, TParent> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent>;
};

export type Resolver<TResult, TParent> = ResolverFn<TResult, TParent> | StitchingResolver<TResult, TParent>;
export default Resolver;
