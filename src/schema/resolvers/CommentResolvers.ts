import { Arg, Ctx, ID, Mutation, Resolver } from 'type-graphql';

import { Comment } from '../../entity/Comment';
import { User } from '../../entity/User';

@Resolver()
export class CommentResolvers {
  @Mutation(() => Comment)
  async createComment(
    @Arg('postId', () => ID) postId: number,
    @Arg('body') body: string,
    @Ctx('user') user: User
  ) {
    return await Comment.create({ postId, body, user }).save();
  }
}
