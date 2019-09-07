import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    email: String!
    joinedDate: Date
    location: String
    bio: String
    posts: [Post]
    following: Int
    followers: Int
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
    getUser(id: ID!): User
    getUsers(searchParam: String!): [User]!
    canFollow(userId: ID!): Boolean!
  }

  extend type Mutation {
    register(userData: RegisterInput): RegisterResponse!
    follow(userId: ID!): Boolean!
    unfollow(userId: ID!): Boolean!
  }
`;
