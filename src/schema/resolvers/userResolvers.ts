import { AuthenticationError, ForbiddenError } from 'apollo-server';
import { IResolverObject } from 'graphql-tools';
import { Like } from 'typeorm';

import { User } from '../../entity/User';

export const resolvers: IResolverObject = {
  Query: {
    hello: () => {
      return 'World';
    },
    login: (_, { username, password }) => {
      return User.findOne({
        where: {
          username: Like(username),
        },
      }).then((user) => {
        console.log(user);
        if (!user) {
          throw new AuthenticationError('User not found');
        }
        if (password !== user.password) {
          throw new AuthenticationError('Invalid password');
        }
        return user.id;
      });
    },
  },
  Mutation: {
    register: (_, { userData }) => {
      const { username, password, firstName, lastName, email } = userData;

      return User.findOne({ username }).then((user) => {
        if (user) {
          throw new ForbiddenError('User already exists');
        }
        return User.create({ username, password, firstName, lastName, email })
          .save()
          .then((user) => {
            console.log('new user', user);
            return user.id;
          });
      });
    },
  },
};
