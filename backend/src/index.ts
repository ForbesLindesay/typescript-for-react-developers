import Koa from 'koa';
import cors from '@koa/cors';
import KoaRouter from '@koa/router';
import koaMount from 'koa-mount';
import * as t from 'funtypes/readonly';
import * as s from 'funtypes-schemas';

import {accounts, contacts} from './data';
import graphqlMiddleware from './graphql/transports/https';

const PORT = process.env.PORT || '8000';
if (!/^\d+$/.test(PORT)) {
  throw new Error(`Expected PORT environment variable to be an integer.`);
}

const server = new Koa();
const app = new KoaRouter();

const idParamsSchema = t.Object({id: s.ParsedIntegerString({min: 1})});

app.get(`/accounts`, (ctx) => {
  ctx.body = accounts;
});
app.get(`/accounts/:id`, (ctx) => {
  const parsedParams = idParamsSchema.safeParse(ctx.params);
  const result = parsedParams.success && accounts.find((a) => a.id == parsedParams.value.id);
  if (result) {
    ctx.body = result;
  }
});

app.get(`/contacts`, (ctx) => {
  ctx.body = contacts;
});
app.get(`/contacts/:id`, (ctx) => {
  const parsedParams = idParamsSchema.safeParse(ctx.params);
  const result = parsedParams.success && contacts.find((a) => a.id == parsedParams.value.id);
  if (result) {
    ctx.body = result;
  }
});
app.get(`/contacts/:id/accounts`, (ctx) => {
  const parsedParams = idParamsSchema.safeParse(ctx.params);
  if (parsedParams.success && contacts.some((a) => a.id == parsedParams.value.id)) {
    ctx.body = accounts.filter((a) => a.contact_id === parsedParams.value.id);
  }
});

server.use(cors());
server.use(koaMount('/graphql', graphqlMiddleware));
server.use(app.middleware());

server.listen(PORT, () => {
  console.warn(`Listening on port: ${PORT}`);
});
