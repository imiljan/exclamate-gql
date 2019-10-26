import { ApolloError, AuthenticationError, ForbiddenError } from 'apollo-server-core';
import bcrypt from 'bcrypt';
import { getLogger } from 'log4js';
import { Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getConnection, getManager, Like } from 'typeorm';

import { Post } from '../../entity/Post';
import { User } from '../../entity/User';
import { createAccessToken } from '../../util/authTokens';
import { RegisterInput } from '../inputTypes/RegisterInput';
import { RegisterResponse } from '../responseTypes/RegisterResponse';
import { TokenResponse } from '../responseTypes/TokenResponse';

const logger = getLogger('UserResolvers.ts');

@Resolver(() => User)
export class UserResolvers {
  @FieldResolver(() => [Post], { nullable: true })
  posts(@Root() user: User) {
    return Post.find({ where: { user: user.id } });
  }

  @FieldResolver()
  async followers(@Root() user: User) {
    const followersData = await getManager().query(
      `SELECT COUNT(DISTINCT f.followingUserId) AS followers
         FROM user u
          LEFT JOIN follow f ON u.userId = f.followedUserId
        WHERE u.userId = ${user.id};`
    );

    logger.info(followersData);

    return followersData.pop().followers;
  }

  @FieldResolver()
  async following(@Root() user: User) {
    const followingsData = await getManager().query(
      `SELECT COUNT(DISTINCT f.followedUserId) AS followings
         FROM user u
          LEFT JOIN follow f ON u.userId = f.followingUserId
        WHERE u.userId = ${user.id};`
    );

    logger.info(followingsData);

    return followingsData.pop().followings;
  }

  @Query(() => User)
  me(@Ctx('user') user: User) {
    return user;
  }

  @Query(() => TokenResponse)
  async login(@Arg('username') username: string, @Arg('password') password: string) {
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
  }

  @Query(() => User)
  async getUser(@Arg('id') id: number) {
    const u = await User.findOne({ where: { id } });
    logger.info(u);

    if (!u) {
      throw new ApolloError('There is no user with that id');
    }
    return u;
  }

  @Query(() => {
    return [User] || [];
  })
  async getUsers(@Arg('searchParam') searchParam: string) {
    const users = User.find({
      where: { username: Like(`%${searchParam}%`) },
    });
    if (!users) {
      return [];
    }
    return users;
  }

  @Query(() => Boolean)
  async canFollow(@Arg('userId') userId: number, @Ctx('user') user: User) {
    return getManager()
      .query(
        `SELECT f.followedUserId AS following
           FROM user u
            LEFT JOIN follow f ON u.userId = f.followingUserId
           WHERE u.userId = ${user.id};`
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
  }

  @Mutation(() => RegisterResponse)
  async register(@Arg('userData') userData: RegisterInput) {
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
  }

  @Mutation(() => Boolean)
  follow(@Arg('userId', () => ID) userId: number, @Ctx('user') user: User) {
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
  }

  @Mutation(() => Boolean)
  unfollow(@Arg('userId', () => ID) userId: number, @Ctx('user') user: User) {
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
  }
}
