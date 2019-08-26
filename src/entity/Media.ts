import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Post } from './Post';

@Entity()
export class Media extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'mediaId' })
  id: string;

  @Column()
  url: string;

  @ManyToOne((type) => Post, (post) => post.medias, { nullable: true })
  post: Post;
}
