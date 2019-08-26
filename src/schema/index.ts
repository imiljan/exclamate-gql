import { gql, makeExecutableSchema } from 'apollo-server';
import { merge } from 'lodash';

import { resolvers as postResolvers } from './resolvers/postResolvers';
import { resolvers as userResolvers } from './resolvers/userResolvers';
import { typeDefs as postTypeDefs } from './typeDefs/postType';
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
  typeDefs: [typeDefs, userTypeDefs, postTypeDefs],
  resolvers: merge(userResolvers, postResolvers),
});

export default schema;
