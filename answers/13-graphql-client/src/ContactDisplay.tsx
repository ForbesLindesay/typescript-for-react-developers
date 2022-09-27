import React from 'react';
import AccountDisplay from './AccountDisplay';
import {GetContacts_contacts} from './api/operations';

export interface ContactDisplayProps {
  contact: GetContacts_contacts;
}
export default function ContactDisplay({contact}: ContactDisplayProps) {
  return (
    <li key={contact.id}>
      {contact.name}
      <ul>
        {contact.accounts.map((account) => (
          <AccountDisplay key={account.id} account={account} />
        ))}
      </ul>
    </li>
  );
}
