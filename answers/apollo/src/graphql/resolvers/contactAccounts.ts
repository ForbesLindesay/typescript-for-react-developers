import ResolverTypes from '../ResolverTypes';
import {AccountType} from '../types/enums';

const contactAccounts: ResolverTypes['Contact']['accounts'] = async (contact) => {
  if (contact.id !== 1) {
    throw new Error(`Could not find accounts for contact ID ${contact.id}`);
  }
  return [
    {
      id: 1,
      type: AccountType.EMAIL,
      value: 'forbes@lindesay.co.uk',
    },
  ];
};
export default contactAccounts;
