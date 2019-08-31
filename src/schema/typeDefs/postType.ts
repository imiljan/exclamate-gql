import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Post {
    id: ID!
    body: String!
    created: Date!
    user: User!
    comments: [Comment]!
    likes: Int!
  }

  extend type Query {
    getPost(id: ID!): Post
    getPosts(offset: Int, limit: Int): [Post]!
  }

  extend type Mutation {
    createPost(body: String!): Post!
  }
`;
