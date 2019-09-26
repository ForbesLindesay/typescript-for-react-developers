import ResolverTypes from '../ResolverTypes';

const contacts: ResolverTypes['Query']['contacts'] = async () => {
  return [{id: 1, name: 'Foo', google: {name: 'Foo', whatever: 42}}];
};
export default contacts;
