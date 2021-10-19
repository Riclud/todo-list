import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('user_tokens')
export class TokenEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  access_token: string;

  @Column()
  refresh_token_key: string;

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
