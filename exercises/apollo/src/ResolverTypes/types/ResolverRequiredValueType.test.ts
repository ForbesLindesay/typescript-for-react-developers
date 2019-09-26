import * as ta from 'type-assertions';
import ResolverRequiredValueType from './ResolverRequiredValueType';

type Resolver = (
  parent: {a?: number; b: number},
  args: {y: number},
  context: {z: number},
  info: {a: number},
) => Promise<string> | string;

ta.assert<ta.Equal<ResolverRequiredValueType<Resolver>, string>>();
