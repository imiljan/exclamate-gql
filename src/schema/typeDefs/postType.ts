import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    created: Date!
  }

  extend type User {
    posts: [Post!]
  }

  extend type Query {
    getPost(id: ID!): Post
  }

  extend type Mutation {
    createPost(body: String!): Post!
  }
`;
