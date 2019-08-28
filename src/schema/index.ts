import { gql, makeExecutableSchema } from 'apollo-server';
import { GraphQLScalarType, Kind } from 'graphql';
import { merge } from 'lodash';

import { resolvers as commentResolvers } from './resolvers/commentResolvers';
import { resolvers as postResolvers } from './resolvers/postResolvers';
import { resolvers as userResolvers } from './resolvers/userResolvers';
import { typeDefs as commentTypeDefs } from './typeDefs/commentType';
import { typeDefs as postTypeDefs } from './typeDefs/postType';
import { typeDefs as userTypeDefs } from './typeDefs/userType';

const typeDefs = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }

  scalar Date
`;

const resolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    //  parseValue: gets invoked to parse client input that was passed through variables.
    parseValue(value: string) {
      console.log('ParseValue: ' + value);
      return new Date(value); // value from the client
    },
    // serialize: gets invoked when serializing the result to send it back to a client.
    serialize(value: Date) {
      console.log('Serialize: ' + value);
      // TODO Format Date
      return `${value}`; // value sent to the client
    },
    // parseLiteral: gets invoked to parse client input that was passed inline in the query.
    parseLiteral(ast: any) {
      // still not sure when this gets invoked
      console.log('Parse literal: ' + ast.kind);
      console.log('Kind: ' + Kind.INT);
      if (ast.kind === Kind.INT) {
        return new Date(ast.value); // ast value is always in string format
      }
      return null;
    },
  }),
};

const schema = makeExecutableSchema({
  typeDefs: [typeDefs, userTypeDefs, postTypeDefs, commentTypeDefs],
  resolvers: merge(resolvers, userResolvers, postResolvers, commentResolvers),
});

export default schema;
