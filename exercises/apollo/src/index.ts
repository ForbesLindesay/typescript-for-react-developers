import Koa = require('koa');
import mount = require('koa-mount');
import graphql from './graphql';
import cors = require('@koa/cors');

const app = new Koa();

const PORT = process.env.PORT || 3000;

app
  .use(cors())
  .use(mount('/graphql', graphql))
  .listen(PORT, () => {
    console.info(`Listening on http://localhost:${PORT}/graphql`);
  });
