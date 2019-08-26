import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    # created: String #TODO Date Scalar
  }

  extend type User {
    posts: [Post!]
  }

  extend type Query {
    getPost(id: ID!): Post
  }

  # extend type Mutation {
  # }
`;
