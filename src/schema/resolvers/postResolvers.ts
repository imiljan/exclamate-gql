import { ForbiddenError } from 'apollo-server';
import { getLogger } from 'log4js';
import { getManager, In } from 'typeorm';

import { Comment } from '../../entity/Comment';
import { Post } from '../../entity/Post';
import { User } from '../../entity/User';
import { Resolvers } from '../../generated/graphql';

const logger = getLogger('postResolvers.ts');

export const resolvers: Resolvers = {
  User: {
    posts: (_, __, { user }) => Post.find({ where: { user } }),
  },
  Post: {
    comments: (post, __, { user }) =>
      Comment.find({ where: { post: post.id }, relations: ['user'] }),
    // TODO Check if this can be achieved in query builder
    likes: async (post: any, _: any, { user }: any) => {
      const numberOfLikes = await getManager().query(
        'select COUNT(DISTINCT l.userId) as likes from post p left join `like` l on p.postId = l.postId where l.postId =' +
          post.id +
          ';'
      );
      return numberOfLikes[0].likes;
    },
  },
  Query: {
    getPost: async (_, { id }, { user }) => {
      if (!user) {
        throw new ForbiddenError('User not logged in');
      }

      const post = await Post.findOne({ where: { id }, relations: ['comments'] });
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

      const p = await Post.find({
        where: whereConditions,
        relations: ['comments', 'medias'],
        order: {
          created: 'DESC',
          id: 'ASC',
        },
      });
      logger.info(p);
      return p;
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
