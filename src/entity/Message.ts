import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Chat } from './Chat';

@Entity()
export class Message extends BaseEntity {
  @PrimaryColumn({ name: 'userId1' })
  participant1: number;

  @PrimaryColumn({ name: 'userId2' })
  participant2: number;

  @PrimaryGeneratedColumn({ name: 'messageId' })
  id: number;

  @Column({ name: 'messageBody' })
  body: string;

  @ManyToOne((type) => Chat, (chat) => chat.messages)
  @JoinColumn([
    { name: 'userId1', referencedColumnName: 'participant1' },
    { name: 'userId2', referencedColumnName: 'participant2' },
  ])
  chat: Chat;
}
