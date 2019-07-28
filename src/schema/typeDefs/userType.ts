import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    firstName: String!
    lastName: String!
    email: String!
  }

  extend type Query {
    hello: String!
    login(username: String!, password: String!): ID
  }

  extend type Mutation {
    register(userData: RegisterInput): ID!
  }
`;
/*
  type Token {
    token: String!
  }
*/
