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

export class ElementCreate extends OK {
  @ApiProperty({
    example: '7760e0eb-3147-454e-8b63-366473ec1202',
    description: 'Element ID',
  })
  id: string;

  constructor(elementID: string) {
    super();
    this.statusCode = HttpStatus.CREATED;
    this.id = elementID;
  }
}
