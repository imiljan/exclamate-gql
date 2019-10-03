import { ApolloError, AuthenticationError, ForbiddenError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import { getLogger } from 'log4js';
import { getConnection, getManager, Like } from 'typeorm';

import { Post } from '../../entity/Post';
import { User } from '../../entity/User';
import { Resolvers } from '../../generated/graphql';
import { createAccessToken } from '../../util/authTokens';

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
        WHERE u.userId = ${user.id};`,
      );

      logger.info(followersData);

      return followersData.pop().followers;
    },
    following: async (user) => {
      const followingsData = await getManager().query(
        `SELECT COUNT(DISTINCT f.followedUserId) AS followings
         FROM user u
          LEFT JOIN follow f ON u.userId = f.followingUserId
        WHERE u.userId = ${user.id};`,
      );

      logger.info(followingsData);

      return followingsData.pop().followings;
    },
  },
  Query: {
    me: (_, __, { user }) => {
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
            token: createAccessToken(user),
          };
        } else {
          throw new AuthenticationError('Invalid password');
        }
      } catch (error) {
        logger.error(error);
        throw error;
      }
    },
    getUser: async (_, { id }) => {
      const u = await User.findOne({ where: { id } });
      logger.info(u);

      if (!u) {
        throw new ApolloError('There is no user with that id');
      }
      return u;
    },
    getUsers: (_, { searchParam }) => {
      const users = User.find({
        where: { username: Like(`%${searchParam}%`) },
      });
      if (!users) {
        return [];
      }
      return users;
    },
    canFollow: (_, { userId }, { user }) => {
      return getManager()
        .query(
          `SELECT f.followedUserId AS following
           FROM user u
            LEFT JOIN follow f ON u.userId = f.followingUserId
           WHERE u.userId = ${user.id};`,
        )
        .then((res: Array<{ following: number }>) => {
          logger.info(res);
          for (const rowDataPacket of res) {
            if (rowDataPacket.following == userId) {
              return false;
            }
          }
          return true;
        });
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
      return { user: newUser, token: createAccessToken(newUser) };
    },
    follow: (_, { userId }, { user }) => {
      return User.findOne(userId).then((followUser) => {
        if (!followUser) {
          throw new ApolloError('User does not exist');
        }
        return getConnection()
          .createQueryBuilder()
          .relation(User, 'followings')
          .of(user)
          .add(followUser)
          .then(() => {
            return true;
          })
          .catch(() => {
            return false;
          });
      });
    },
    unfollow: (_, { userId }, { user }) => {
      return User.findOne(userId).then((followUser) => {
        if (!followUser) {
          throw new ApolloError('User does not exist');
        }
        return getConnection()
          .createQueryBuilder()
          .relation(User, 'followings')
          .of(user)
          .remove(followUser)
          .then(() => {
            return true;
          })
          .catch(() => {
            return false;
          });
      });
    },
  },
};
