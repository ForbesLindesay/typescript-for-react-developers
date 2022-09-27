import React from 'react';
import {GetContacts} from './api/operations';
import request from './api/request';
import ContactDisplay from './ContactDisplay';
import useApiResponse from './useApiResponse';

async function getContacts() {
  const result = await request(GetContacts).execute();
  if (result.ok) {
    return result.data.contacts;
  } else {
    throw new Error(`GraphQL Error: ${JSON.stringify(result.errors[0])}`);
  }
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
