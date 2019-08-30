import { ApolloError, AuthenticationError, ForbiddenError } from 'apollo-server';
import * as bcrypt from 'bcrypt';
import { getLogger } from 'log4js';
import { getManager, Like } from 'typeorm';

import { Post } from '../../entity/Post';
import { User } from '../../entity/User';
import { Resolvers } from '../../generated/graphql';
import { createToken } from '../../util/auth';

const logger = getLogger('userResolvers.ts');

export const resolvers: Resolvers = {
  User: {
    posts: (user) => Post.find({ where: { user: user.id } }),

    // TODO: try to optimize
    followers: async (user) => {
      const followersData = await getManager().query(
        `SELECT COUNT(DISTINCT f.followingUserId) AS followers
         FROM user u
          LEFT JOIN follow f ON u.userId = f.followedUserId
        WHERE u.userId = ${user.id};`
      );

      logger.info(followersData);

      return followersData.pop().followers;
    },
    following: async (user) => {
      const followingsData = await getManager().query(
        `SELECT COUNT(DISTINCT f.followedUserId) AS followings
         FROM user u
          LEFT JOIN follow f ON u.userId = f.followingUserId
        WHERE u.userId = ${user.id};`
      );

      logger.info(followingsData);

      return followingsData.pop().followings;
    },
  },
  Query: {
    me: (_, __, { user }) => {
      if (!user) {
        throw new ForbiddenError('User not logged in');
      }
      return user;
    },
    login: async (_, { username, password }) => {
      try {
        const user = await User.findOne({
          where: {
            username: Like(username),
          },
        });

        if (!user) {
          throw new AuthenticationError('User not found');
        }
        logger.debug(user);

        if (await bcrypt.compare(password, user.password)) {
          return {
            token: createToken(user),
          };
        } else {
          throw new AuthenticationError('Invalid password');
        }
      } catch (error) {
        logger.error(error);
        throw error;
      }
    },
    getUser: async (_, { id }, { user }) => {
      if (!user) {
        throw new ForbiddenError('User not logged in');
      }
      const u = await User.findOne({ where: { id } });
      logger.info(u);

      if (!u) {
        throw new ApolloError('There is no user with that id');
      }
      return u;
    },
  },
  Mutation: {
    register: async (_, { userData }) => {
      if (!userData) {
        throw new ApolloError('Bad input params');
      }
      const { username, password, firstName, lastName, email } = userData;

      const user = await User.findOne({ username });
      if (user) {
        throw new ForbiddenError('User already exists');
      }

      const newUser = await User.create({
        username,
        password: await bcrypt.hash(password, 10),
        firstName,
        lastName,
        email,
      }).save();

      delete newUser.password;
      return { user: newUser, token: createToken(newUser) };
    },
  },
};
