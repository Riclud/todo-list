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
import { TaskFileEntity } from './task-file.entity';
import { TodoFolderEntity } from './todo-folder.entity';

@Entity('todo_tasks')
export class TodoTaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  сhecked: boolean;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'user_id' })
  userID: string;

  @ManyToOne(() => TodoFolderEntity, (folder) => folder.id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'folder_id' })
  folder: TodoFolderEntity;

  @Column({ name: 'folder_id' })
  folderID: string;

  @OneToMany(() => TaskFileEntity, (file) => file.task, { cascade: true })
  @JoinTable()
  files: TaskFileEntity[];
}
