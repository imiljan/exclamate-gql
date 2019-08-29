import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    email: String!
    joinedDate: Date
    posts: [Post]
  }

  type Token {
    token: String!
  }

  type RegisterResponse {
    user: User
    token: String
  }

  input RegisterInput {
    username: String!
    password: String!
    firstName: String!
    lastName: String!
    email: String!
  }

  extend type Query {
    login(username: String!, password: String!): Token!
    me: User!
  }

  extend type Mutation {
    register(userData: RegisterInput): RegisterResponse!
  }
`;
