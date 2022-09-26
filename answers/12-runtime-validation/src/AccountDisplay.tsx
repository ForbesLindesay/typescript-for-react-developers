import React from 'react';
import {Account} from './types';

export interface AccountDisplayProps {
  account: Account;
}
const AccountIcons: {[type in Account['type']]: string} = {
  EMAIL: `📨`,
  INSTAGRAM: `📸`,
  FACEBOOK: `F`,
  GOOGLE: `G`,
};
export default function AccountDisplay({account}: AccountDisplayProps) {
  return (
    <li key={account.id}>
      {AccountIcons[account.type]} - {account.value}
    </li>
  );
}
