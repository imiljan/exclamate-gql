import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Comment } from './Comment';
import { Media } from './Media';
import { User } from './User';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ name: 'postId' })
  id: number;

  @Field()
  @Column({ name: 'postBody', length: 180 })
  body: string;

  @Field()
  @CreateDateColumn({ name: 'createdDate' })
  created: Date;

  @Field()
  @ManyToOne(() => User, (user) => user.posts, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @Field(() => [Comment])
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Media, (media) => media.post)
  medias: Media[];

  @ManyToMany(() => User, (user) => user.reposts)
  usersReposted: User[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'like',
    joinColumn: { name: 'postId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  usersLiked: User[];

  @Field(() => Int)
  likes: number;
}
