import * as t from 'funtypes/readonly';
import * as s from 'funtypes-schemas';

export enum AccountType {
  Email = 'EMAIL',
  Instagram = 'INSTAGRAM',
  Facebook = 'FACEBOOK',
  Google = 'GOOGLE',
}

// TODO: define schemas for Account and Contact using funtypes
//       and extract types using t.Static<typeof X>

export const AccountSchema = null;
export type Account = unknown;

export const ContactSchema = null;
export type Contact = unknown;
