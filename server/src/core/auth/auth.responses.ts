import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class AuthOK {
  @ApiProperty({ example: HttpStatus.OK })
  statusCode: number;
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3GEMA0IICOfFMVXY7kkTX1wr4qCyhIf58U',
  })
  access_token: string;
  constructor(access_token: string) {
    this.statusCode = HttpStatus.OK;
    this.access_token = access_token;
  }

  getData() {
    return {
      statusCode: this.statusCode,
      access_token: this.access_token,
    };
  }
}
