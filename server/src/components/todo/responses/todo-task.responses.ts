import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { TodoTaskType } from '../types/todo-task.type';

export class TodoTaskResponse {
  @ApiProperty({ example: HttpStatus.OK })
  statusCode: number;
  data: TodoTaskType;

  constructor(data: any) {
    this.statusCode = HttpStatus.OK;
    this.data = data;
  }

  getData() {
    return {
      statusCode: this.statusCode,
      data: this.data,
    };
  }
}
