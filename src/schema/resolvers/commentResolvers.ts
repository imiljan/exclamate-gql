import { ForbiddenError } from 'apollo-server';

import { Comment } from '../../entity/Comment';
import { Resolvers } from '../../generated/graphql';

// import { getLogger } from 'log4js';
// const logger = getLogger('commentResolvers.ts');

export const resolvers: Resolvers = {
  Query: {},
  Mutation: {
    createComment: async (_, { postId, body }, { user }) => {
      if (!user) {
        throw new ForbiddenError('User not logged in');
      }
      const newComment = await Comment.create({ postId, body, user }).save();
      return newComment;
    },
  },
};
