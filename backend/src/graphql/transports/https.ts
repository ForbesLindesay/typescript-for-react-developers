import {ApolloServer} from 'apollo-server-koa';
import Koa from 'koa';

import {getResolverContextForRequest} from '../ResolverContext';
import schema from '../schema';

const server = new ApolloServer({
  schema,
  context: (input) => getResolverContextForRequest(input.ctx),
  playground: {
    endpoint: '/graphql',
    subscriptionEndpoint: '/graphql',
  },
});

const graphqlMiddleware = new Koa();

server.applyMiddleware({
  app: graphqlMiddleware,
  path: '/',
});

export default graphqlMiddleware;
