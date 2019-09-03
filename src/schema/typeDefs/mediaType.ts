import { gql } from 'apollo-server';

export const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  extend type Query {
    getMedias(userId: Int!): [File]
  }

  extend type Mutation {
    singleUpload(file: Upload!): File!
  }
`;
