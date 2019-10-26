import { ApolloError } from 'apollo-server-core';
import { Arg, Ctx, FieldResolver, ID, Int, Mutation, Query, Resolver, Root } from 'type-graphql';
import { getManager, In } from 'typeorm';

import { Comment } from '../../entity/Comment';
import { Post } from '../../entity/Post';
import { User } from '../../entity/User';

@Resolver(() => Post)
export class PostResolvers {
  // TODO Check if this is needed because there is join on getPost query
  @FieldResolver(() => Comment)
  comments(@Root('post') post: Post) {
    return Comment.find({ where: { postId: post.id }, relations: ['user'] });
  }

  @FieldResolver()
  async likes(@Root('post') post: Post) {
    const numberOfLikes = await getManager().query(
      `select COUNT(DISTINCT l.userId) as likes from post p
        left join \`like\` l on p.postId = l.postId
       where l.postId = ${post.id};`
    );
    return parseInt(numberOfLikes[0].likes, 10);
  }

  @Query(() => Post, { nullable: true })
  async getPost(@Arg('id', () => ID) id: number) {
    const post = await Post.findOne({
      where: { id },
      relations: ['comments'],
    });
    return post ? post : null;
  }

  @Query(() => [Post])
  async getPosts(
    @Arg('offset', () => Int, { defaultValue: 0 }) offset: number,
    @Arg('limit', () => Int, { defaultValue: 10 }) limit: number,
    @Ctx('user') user: User
  ) {
    const whereConditions: any = [{ user }];
    const userWithFollowings = await User.findOne(user.id, {
      relations: ['followings'],
    });
    if (userWithFollowings && userWithFollowings.followings.length !== 0) {
      whereConditions.push({
        user: In([user.id, ...userWithFollowings.followings.map((e) => e.id)]),
      });
    }
    return await Post.find({
      where: whereConditions,
      relations: ['comments'],
      order: {
        created: 'DESC',
        id: 'ASC',
      },
      skip: offset ? offset : 0,
      take: limit ? limit : 10,
    });
  }

  @Mutation(() => Post)
  createPost(@Arg('body') body: string, @Ctx('user') user: User) {
    return Post.create({ body, user }).save();
  }

  @Mutation(() => Boolean)
  deletePost(@Arg('postId', () => ID) postId: number) {
    return Post.findOne(postId).then((post) => {
      if (post) {
        return post.remove().then(() => true);
      }
      return false;
    });
  }

  @Mutation(() => Post)
  async editPost(@Arg('postId', () => ID) postId: number, @Arg('body') body: string) {
    const post = await Post.findOne(postId);
    if (post) {
      post.body = body.trim();
      await post.save();
      return post;
    } else {
      throw new ApolloError('Post not edited');
    }
  }
}
