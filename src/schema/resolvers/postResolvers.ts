import { ForbiddenError } from 'apollo-server';
import { getManager, In } from 'typeorm';

import { Comment } from '../../entity/Comment';
import { Post } from '../../entity/Post';
import { User } from '../../entity/User';
import { Resolvers } from '../../generated/graphql';

// const logger = getLogger('postResolvers.ts');

export const resolvers: Resolvers = {
  Post: {
    // TODO Check if this is needed because there is join on getPost query
    comments: (post) => Comment.find({ where: { post: post.id }, relations: ['user'] }),
    // TODO Check if this can be achieved in query builder
    likes: async (post) => {
      const numberOfLikes = await getManager().query(
        'select COUNT(DISTINCT l.userId) as likes from post p left join `like` l on p.postId = l.postId where l.postId =' +
          post.id +
          ';'
      );
      return parseInt(numberOfLikes[0].likes, 10);
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
    getPosts: async (_, { offset, limit }, { user }) => {
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
        relations: ['comments'],
        order: {
          created: 'DESC',
          id: 'ASC',
        },
        skip: offset ? offset : 0,
        take: limit ? limit : 10,
      });
      // logger.info(p);
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
