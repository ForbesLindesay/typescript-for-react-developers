import {AccountType} from '../../../types';
import {GraphQlAccountResolvers, GraphQlAccountType} from '../../__generated__/types';

const typesMap: Record<AccountType, GraphQlAccountType> = {
  [AccountType.Email]: GraphQlAccountType.Email,
  [AccountType.InstagramUsername]: GraphQlAccountType.InstagramUsername,
  [AccountType.PhoneNumber]: GraphQlAccountType.PhoneNumber,
};

const Account: GraphQlAccountResolvers = {
  id: (v) => v.id,
  type: (v) => typesMap[v.type],
  value: (v) => v.value,
};

export default Account;
