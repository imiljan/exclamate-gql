import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from './User';

@Entity()
export class Device extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', name: 'deviceId' })
  id: string;

  @ManyToOne(() => User, (user) => user.devices, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
