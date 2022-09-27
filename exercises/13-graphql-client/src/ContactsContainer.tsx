import React from 'react';
import {GetContacts} from './api/operations';
import request from './api/request';
import ContactDisplay from './ContactDisplay';
import useApiResponse from './useApiResponse';

async function getContacts(): Promise<Contact[]> {
  // TODO: pass `GetContacts` to `request`
  // TODO: throw an error if `result.ok === false`
  // TODO: return the contacts if `result.ok === true`
}
export default function ContactsContainer() {
  const contactsState = useApiResponse(getContacts);
  switch (contactsState.status) {
    case 'loading':
      return <p>Loading contacts...</p>;
    case 'failed':
      return (
        <p>
          Failed to load contacts:
          <br />
          <pre>{contactsState.reason}</pre>
        </p>
      );
    case 'loaded':
      return (
        <ul>
          {contactsState.value.map((contact) => (
            <ContactDisplay key={contact.id} contact={contact} />
          ))}
        </ul>
      );
  }
}
