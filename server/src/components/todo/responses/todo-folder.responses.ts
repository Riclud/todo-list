import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { TodoFolderType } from '../types/todo-folder.type';

export class TodoFolderResponse {
  @ApiProperty({ example: HttpStatus.OK })
  statusCode: number;
  @ApiProperty({ type: TodoFolderType })
  folder: TodoFolderType;

  constructor(folder: any) {
    this.statusCode = HttpStatus.OK;
    this.folder = folder;
  }

  getData() {
    return {
      statusCode: this.statusCode,
      folder: this.folder,
    };
  }
}

export class TodoFoldersResponse {
  @ApiProperty({ example: HttpStatus.OK })
  statusCode: number;
  @ApiProperty({ type: TodoFolderType })
  folders: TodoFolderType[];

  constructor(folders: any[]) {
    this.statusCode = HttpStatus.OK;
    this.folders = folders;
  }

  getData() {
    return {
      statusCode: this.statusCode,
      folders: this.folders,
    };
  }
}
