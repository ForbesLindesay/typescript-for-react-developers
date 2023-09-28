import * as t from 'funtypes';
import {Account, AccountSchema, Contact, ContactSchema} from './types';

export async function getContacts(): Promise<Contact[]> {
  const result = await fetch(`http://localhost:8000/contacts`);
  if (!result.ok) {
    throw new Error(`API failed: ${await result.text()}`);
  }
  const resultData = await result.json();
  return t.Array(ContactSchema).parse(resultData);
}

export async function getAccounts(contactId: number): Promise<Account[]> {
  const result = await fetch(`http://localhost:8000/contacts/${contactId}/accounts`);
  if (!result.ok) {
    throw new Error(`API failed: ${await result.text()}`);
  }
  const resultData = await result.json();
  return t.Array(AccountSchema).parse(resultData);
}
