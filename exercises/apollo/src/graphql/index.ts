import Koa = require('koa');
import {ApolloServer} from 'apollo-server-koa';
import compress = require('koa-compress');

import typeDefs from './__generated__/schema';
import ResolverTypes from './ResolverTypes';

import contacts from './resolvers/contacts';
import contactAccounts from './resolvers/contactAccounts';

import GooglePerson from './scalars/GooglePersonScalar';
import TrimmedString from './scalars/TrimmedStringScalar';

import createContact from './mutations/createContact';

import ResolverContext from './ResolverContext';

const Mutations: ResolverTypes['Mutation'] = {
  createContact,
};

export const resolvers: ResolverTypes = {
  Query: {
    contacts,
  },
  Contact: {
    accounts: contactAccounts,
  },
  Mutation: Mutations,
  GooglePerson,
  TrimmedString,
};

const server = new ApolloServer({
  typeDefs,
  resolvers: resolvers as any,
  context: ({ctx}) => new ResolverContext(ctx),
  playground: {
    endpoint: '/graphql',
  },
});

const graphql = new Koa();

graphql.use(compress());

server.applyMiddleware({
  app: graphql,
  path: '/',
});

export default graphql;
