import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('restore_code_users')
export class RestoreCodeEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  code: string;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: string;

  @Column({ name: 'user_id' })
  userID: string;
}
