import * as ta from 'type-assertions';
import ResolverImplicitPropType from './ResolverImplicitPropType';

type Resolver = (
  parent: {a?: number; b: number; c: string},
  args: {y: string},
  context: {z: string},
  info: {a: string},
) => Promise<string> | string;

ta.assert<ta.Equal<ResolverImplicitPropType<Resolver, 'a'>, number | undefined>>();
ta.assert<ta.Equal<ResolverImplicitPropType<Resolver, 'b'>, number>>();
ta.assert<ta.Equal<ResolverImplicitPropType<Resolver, 'c'>, string>>();
ta.assert<ta.Equal<ResolverImplicitPropType<Resolver, 'y'>, undefined>>();
