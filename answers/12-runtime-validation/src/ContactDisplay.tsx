import React from 'react';
import AccountsContainer from './AccountsContainer';
import {Contact} from './types';

export interface ContactDisplayProps {
  contact: Contact;
}
export default function ContactDisplay({contact}: ContactDisplayProps) {
  return (
    <li key={contact.id}>
      {contact.name}
      <AccountsContainer contactId={contact.id} />
    </li>
  );
}
