import { TodoTaskType } from './todo-task.type';
import { ApiProperty } from '@nestjs/swagger';

export class TodoFolderType {
  @ApiProperty({ example: '5cfcc81b-324f-492f-beab-5246d6e27cb8' })
  id: string;
  @ApiProperty({ example: 'Folder name' })
  name: string;
  @ApiProperty({ type: TodoTaskType })
  tasks: TodoTaskType[] | [];
}
