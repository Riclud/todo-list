import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../../core/user/user.entity';
import { TodoTaskEntity } from './todo-task.entity';

@Entity('todo_folders')
export class TodoFolderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  userID: string;

  @OneToMany(() => TodoTaskEntity, (task) => task.folder, { cascade: true })
  @JoinTable()
  tasks: TodoTaskEntity[];
}
