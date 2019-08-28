import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Comment {
    id: ID!
    body: String!
    created: Date!
    user: User!
  }
`;
