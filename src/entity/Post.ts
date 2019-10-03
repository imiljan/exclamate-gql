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

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'postId' })
  id: number;

  @Column({ name: 'postBody', length: 180 })
  body: string;

  @CreateDateColumn({ name: 'createdDate' })
  created: Date;

  @ManyToOne(() => User, (user) => user.posts, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

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

  likes: number;
}
