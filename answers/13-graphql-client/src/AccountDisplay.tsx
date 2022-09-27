import React from 'react';
import {GetContacts_contacts_accounts} from './api/operations';

export interface AccountDisplayProps {
  account: GetContacts_contacts_accounts;
}
const AccountIcons: {[type in GetContacts_contacts_accounts['type']]: string} = {
  EMAIL: `📨`,
  INSTAGRAM_USERNAME: `📸`,
  PHONE_NUMBER: `☎️`,
};
export default function AccountDisplay({account}: AccountDisplayProps) {
  return (
    <li key={account.id}>
      {AccountIcons[account.type]} - {account.value}
    </li>
  );
}
