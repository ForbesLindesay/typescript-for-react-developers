import {readFileSync} from 'fs';

import * as t from 'funtypes/readonly';

import {AccountSchema, ContactSchema} from './types';

export const accounts = readDataFile(`accounts`, t.Array(AccountSchema));
export const contacts = readDataFile(`contacts`, t.Array(ContactSchema));

function dataFile(name: string) {
  return `${__dirname}/../data/${name}.json`;
}
function readDataFile<T>(name: string, schema: t.Codec<T>) {
  return schema.parse(JSON.parse(readFileSync(dataFile(name), `utf8`)));
}
