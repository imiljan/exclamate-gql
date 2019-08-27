import { ApolloError, AuthenticationError, ForbiddenError } from 'apollo-server';
import * as bcrypt from 'bcrypt';
import { getLogger } from 'log4js';
import { Like } from 'typeorm';

import { User } from '../../entity/User';
import { Resolvers } from '../../generated/graphql';
import { createToken } from '../../util/auth';

const logger = getLogger('userResolvers.ts');

export const resolvers: Resolvers = {
  Query: {
    hello: () => {
      return 'World';
    },
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
      logger.debug('new user', newUser);
      return { user: newUser, token: createToken(newUser) };
    },
  },
};
