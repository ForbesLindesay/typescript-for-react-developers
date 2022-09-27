import React from 'react';
import AccountDisplay from './AccountDisplay';

export interface ContactDisplayProps {
  contact: Contact;
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
