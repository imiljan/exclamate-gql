import { gql, makeExecutableSchema } from 'apollo-server';
import { merge } from 'lodash';

import { resolvers as userResolvers } from './resolvers/userResolvers';
import { typeDefs as userTypeDefs } from './typeDefs/userType';

const typeDefs = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

const schema = makeExecutableSchema({
  typeDefs: [typeDefs, userTypeDefs],
  resolvers: merge(userResolvers),
});

export default schema;
