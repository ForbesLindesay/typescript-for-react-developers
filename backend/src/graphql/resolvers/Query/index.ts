import {contacts} from '../../../data';
import {GraphQlQueryResolvers} from '../../__generated__/types';

const Query: GraphQlQueryResolvers = {
  contacts: () => [...contacts],
};

export default Query;
