import { Post } from '../../entity/Post';
import { Resolvers } from '../../generated/graphql';

// import { getLogger } from 'log4js';
// const logger = getLogger('userResolvers.ts');

export const resolvers: Resolvers = {
  User: {
    posts: (_, __, { user }) => Post.find({ where: { user } }),
  },
  Query: {
    getPost: async (_, { id }) => {
      const post = await Post.findOne({ where: { id }, relations: ['comments', 'medias'] });
      return post ? post : null;
    },
  },
  Mutation: {},
};
