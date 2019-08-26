import { BaseEntity, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Message } from './Message';

@Entity()
export class Chat extends BaseEntity {
  @PrimaryColumn({ name: 'userId1' })
  participant1: number;

  @PrimaryColumn({ name: 'userId2' })
  participant2: number;

  @OneToMany((type) => Message, (message) => message.chat)
  messages: Message[];
}
