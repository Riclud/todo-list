import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class OK {
  @ApiProperty({ example: HttpStatus.OK })
  statusCode: number;
  @ApiProperty({ example: 'ok' })
  message: string;

  constructor() {
    this.statusCode = HttpStatus.OK;
    this.message = 'ok';
  }

  getData() {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
