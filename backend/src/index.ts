import {readFileSync} from 'fs';

import Koa from 'koa';
import cors from '@koa/cors';
import KoaRouter from '@koa/router';
import * as t from 'funtypes/readonly';
import * as s from 'funtypes-schemas';

import {AccountSchema, ContactSchema} from './types';

const PORT = process.env.PORT || '8000';
if (!/^\d+$/.test(PORT)) {
  throw new Error(`Expected PORT environment variable to be an integer.`);
}

const server = new Koa();
const app = new KoaRouter();

const accounts = readDataFile(`accounts`, t.Array(AccountSchema));
const contacts = readDataFile(`contacts`, t.Array(ContactSchema));

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
server.use(app.middleware());

server.listen(PORT, () => {
  console.warn(`Listening on port: ${PORT}`);
});

function dataFile(name: string) {
  return `${__dirname}/../data/${name}.json`;
}
function readDataFile<T>(name: string, schema: t.Codec<T>) {
  return schema.parse(JSON.parse(readFileSync(dataFile(name), `utf8`)));
}
