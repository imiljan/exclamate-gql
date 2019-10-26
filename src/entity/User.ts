import { Field, ID, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Comment } from './Comment';
import { Device } from './Device';
import { Media } from './Media';
import { Message } from './Message';
import { Notification } from './Notification';
import { Post } from './Post';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ name: 'userId' })
  id: number;

  @Field()
  @Column({ length: 30 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Field()
  @Column({ length: 30 })
  firstName: string;

  @Field()
  @Column({ length: 30 })
  lastName: string;

  @Field()
  @Column({ length: 50 })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  bio: string;

  @Field({ nullable: true })
  @Column({ length: 30, nullable: true })
  location: string;

  @Field()
  @CreateDateColumn()
  joinedDate: Date;

  @Field(() => Int, { nullable: true })
  followers: number;

  @Field(() => Int, { nullable: true })
  following: number;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Device, (device) => device.user)
  devices: Device[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToOne(() => Media)
  @JoinColumn({ name: 'pictureId' })
  profilePicture: Media;

  @ManyToMany(() => Post, (post) => post.usersReposted)
  @JoinTable({
    name: 'repost',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'postId', referencedColumnName: 'id' },
  })
  reposts: Post[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'follow',
    joinColumn: { name: 'followingUserId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'followedUserId', referencedColumnName: 'id' },
  })
  followings: User[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];
}
