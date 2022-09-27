import React from 'react';

export interface AccountDisplayProps {
  account: Account;
}
const AccountIcons: {[type in Account['type']]: string} = {
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
