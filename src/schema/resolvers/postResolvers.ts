import { ForbiddenError } from 'apollo-server';
import { In } from 'typeorm';

import { Post } from '../../entity/Post';
import { User } from '../../entity/User';
import { Resolvers } from '../../generated/graphql';

// import { getLogger } from 'log4js';
// const logger = getLogger('userResolvers.ts');

export const resolvers: Resolvers = {
  User: {
    posts: (_, __, { user }) => Post.find({ where: { user } }),
  },
  Query: {
    getPost: async (_, { id }, { user }) => {
      if (!user) {
        throw new ForbiddenError('User not logged in');
      }
      const post = await Post.findOne({ where: { id }, relations: ['comments', 'medias'] });
      return post ? post : null;
    },
    getPosts: async (_, __, { user }) => {
      if (!user) {
        throw new ForbiddenError('User not logged in');
      }

      const whereConditions: any = [{ user }];
      const userWithFollowings = await User.findOne(user.id, { relations: ['followings'] });

      if (userWithFollowings && userWithFollowings.followings.length !== 0) {
        whereConditions.push({ user: In(userWithFollowings.followings.map((e) => e.id)) });
      }

      return Post.find({
        where: whereConditions,
        relations: ['comments', 'medias'],
        order: {
          created: 'DESC',
          id: 'ASC',
        },
      });
    },
  },
  Mutation: {
    createPost: async (_, { body }, { user }) => {
      if (!user) {
        throw new ForbiddenError('User not logged in');
      }
      const newPost = await Post.create({ body, user }).save();
      return newPost;
    },
  },
};
