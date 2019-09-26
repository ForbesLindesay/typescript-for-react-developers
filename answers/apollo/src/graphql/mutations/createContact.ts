import ResolverTypes from '../ResolverTypes';

let nextID = 2;
const createContact: ResolverTypes['Mutation']['createContact'] = (_, {contact}) => {
  return {id: nextID++, name: contact.name, google: contact.google};
};
export default createContact;
