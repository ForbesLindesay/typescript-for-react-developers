import React from 'react';
import {getContacts} from './api';
import ContactDisplay from './ContactDisplay';
import useApiResponse from './useApiResponse';

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
