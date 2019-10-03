import { gql } from 'apollo-server-express';

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
    deletePost(postId: ID!): Boolean!
    editPost(postId: ID!, body: String!): Post!
  }
`;
