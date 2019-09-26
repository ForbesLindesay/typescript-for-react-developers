import {AccountType} from './enums';
import {GooglePerson} from './scalars';

export interface Contact {
  id: number;
  name: string;
  google: GooglePerson;
}

export interface Account {
  id: number;
  type: AccountType;
  value: string;
}
