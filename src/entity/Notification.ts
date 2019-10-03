import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from './User';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'notificationId' })
  id: string;

  @Column({ name: 'notificationBody', length: 100 })
  body: string;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
