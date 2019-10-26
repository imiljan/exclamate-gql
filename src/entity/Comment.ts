import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Post } from './Post';
import { User } from './User';

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ name: 'commentId' })
  id: number;

  @ManyToOne(() => Post, (post) => post.comments, {
    primary: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  post: Post;

  @Column({ name: 'postId' })
  postId: number;

  @Field()
  @Column({ name: 'commentBody', length: 180 })
  body: string;

  @Field()
  @CreateDateColumn({ name: 'createdDate' })
  created: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
