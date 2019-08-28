import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './User';

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'messageId' })
  id: number;

  @PrimaryColumn({ name: 'senderId' })
  senderId: number;

  @PrimaryColumn({ name: 'receiverId' })
  receiverId: number;

  @Column({ name: 'messageBody' })
  body: string;

  @CreateDateColumn()
  created: Date;

  @ManyToOne(() => User, (user) => user.sentMessages, {
    primary: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedMessages, {
    primary: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  receiver: User;
}
