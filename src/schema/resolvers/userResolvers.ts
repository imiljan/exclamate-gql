import { IResolverObject } from 'graphql-tools';

export const resolvers: IResolverObject = {
  Query: {
    hello: () => {
      return 'World';
    },
  },
  Mutation: {},
};
