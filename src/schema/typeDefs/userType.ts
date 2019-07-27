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

  extend type Query {
    hello: String!
    login(username: String!, password: String!): ID
  }
`;
/*
  type Token {
    token: String!
  }

  extend type Query {
    getUser(id: ID!): User!
    login(username: String!, password: String!): Token
  }

  extend type Mutation {
    register(
      username: String!
      password: String!
      repeatPassword: String!
      firstName: String!
      lastName: String!
      email: String!
    ): Token
  }
`;
*/
