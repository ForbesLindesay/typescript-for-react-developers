import {ApolloServer} from '@apollo/server';
import {koaMiddleware} from '@as-integrations/koa';

import {getResolverContextForRequest} from '../ResolverContext';
import schema from '../schema';

const server = new ApolloServer({schema});

const middlewarePromise = (async () => {
  await server.start();
  return koaMiddleware(server, {
    context: async (input) => getResolverContextForRequest(input.ctx),
  });
})();

const middleware: ReturnType<typeof koaMiddleware> = async (ctx, next) => {
  return (await middlewarePromise)(ctx, next);
};

export default middleware;
