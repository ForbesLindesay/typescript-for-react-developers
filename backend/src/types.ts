import * as t from 'funtypes/readonly';
import * as s from 'funtypes-schemas';

export enum AccountType {
  Email = 'EMAIL',
  Instagram = 'INSTAGRAM',
  Facebook = 'FACEBOOK',
  Google = 'GOOGLE',
}

export const AccountSchema = t.Named(
  `Account`,
  t.Object({
    id: s.Integer({min: 1}),
    contact_id: s.Integer({min: 1}),
    type: t.Enum(`AccountType`, AccountType),
    value: t.String,
  }),
);
export type Account = t.Static<typeof AccountSchema>;

export const ContactSchema = t.Named(
  `Contact`,
  t.Object({
    id: s.Integer({min: 1}),
    name: t.String,
  }),
);
export type Contact = t.Static<typeof ContactSchema>;
