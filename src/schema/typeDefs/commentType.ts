import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Comment {
    id: ID!
    body: String!
    created: Date!
    user: User!
  }

  extend type Mutation {
    createComment(postId: Int!, body: String!): Comment!
  }
`;
