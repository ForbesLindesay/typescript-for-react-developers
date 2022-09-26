import {Context} from 'koa';

export default class ResolverContext {
  // TODO: add user context from request
}

export function getResolverContextForRequest(_ctx: Context) {
  return new ResolverContext();
}
