import React, {useCallback} from 'react';
import AccountDisplay from './AccountDisplay';
import {getAccounts} from './api';
import useApiResponse from './useApiResponse';

export interface AccountsContainerProps {
  contactId: number;
}
export default function AccountsContainer({contactId}: AccountsContainerProps) {
  const getAccountsMemo = useCallback(() => getAccounts(contactId), [contactId]);
  const accountsState = useApiResponse(getAccountsMemo);
  switch (accountsState.status) {
    case 'loading':
      return <p>Loading accounts...</p>;
    case 'failed':
      return (
        <p>
          Failed to load accounts:
          <br />
          <pre>{accountsState.reason}</pre>
        </p>
      );
    case 'loaded':
      return (
        <ul>
          {accountsState.value.map((account) => (
            <AccountDisplay key={account.id} account={account} />
          ))}
        </ul>
      );
  }
}
