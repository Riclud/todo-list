import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskFileController } from './controllers/task-file.controller';
import { TodoFolderController } from './controllers/todo-folder.controller';
import { TodoTaskController } from './controllers/todo-task.controller';
import { TaskFileEntity } from './entites/task-file.entity';
import { TodoFolderEntity } from './entites/todo-folder.entity';
import { TodoTaskEntity } from './entites/todo-task.entity';
import { TaskFileService } from './services/task-file.service';
import { TodoFolderService } from './services/todo-folder.service';
import { TodoTaskService } from './services/todo-task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TodoFolderEntity,
      TodoTaskEntity,
      TaskFileEntity,
    ]),
  ],
  providers: [TodoFolderService, TodoTaskService, TaskFileService],
  controllers: [TodoFolderController, TodoTaskController, TaskFileController],
})
export class TodoModule {}
