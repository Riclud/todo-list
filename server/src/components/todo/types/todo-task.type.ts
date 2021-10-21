import { TaskFileType } from './task-file.type';
import { ApiProperty } from '@nestjs/swagger';

export class TodoTaskType {
  @ApiProperty({ example: '6cea8b91-2510-42f4-84cd-0ecc99fdacf7' })
  id: string;
  @ApiProperty({ example: 'Task name' })
  name: string;
  @ApiProperty({ example: true })
  сhecked: boolean;
  @ApiProperty({ example: 'Task description' })
  description: string;
  @ApiProperty({ example: '08ab414a-901f-4ea5-891b-5dce78424306' })
  folderID: string;
  @ApiProperty({ type: TaskFileType })
  fiels: TaskFileType[] | [];
}
