import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedException extends HttpException {
  @ApiProperty({ example: HttpStatus.UNAUTHORIZED })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized' })
  message: string;

  constructor() {
    const statusCode = HttpStatus.UNAUTHORIZED;
    const message = 'Unauthorized';
    super(message, statusCode);

    this.statusCode = statusCode;
    this.message = message;
  }

  getData() {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}

export class BadRequestException extends HttpException {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;

  @ApiProperty({ example: 'error message' })
  message: string;

  constructor(message: string) {
    const statusCode = HttpStatus.BAD_REQUEST;
    super(message, statusCode);

    this.statusCode = statusCode;
    this.message = message;
  }

  getData() {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
