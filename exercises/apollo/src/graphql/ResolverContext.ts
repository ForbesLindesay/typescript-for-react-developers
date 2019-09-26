import * as Koa from 'koa';

export default class ResolverContext {
  readonly ctx: Koa.Context;

  constructor(ctx: Koa.Context) {
    this.ctx = ctx;
  }
}
