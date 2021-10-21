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

  @ApiProperty({ example: 'Error message' })
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

export class AccessErrorException extends HttpException {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;

  @ApiProperty({ example: 'Acces error' })
  message: string;

  constructor() {
    const statusCode = HttpStatus.BAD_REQUEST;
    const message = 'Acces error';
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

export class ElementNotFound extends HttpException {
  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  statusCode: number;

  @ApiProperty({ example: 'Element not found' })
  message: string;

  constructor(elementName: string) {
    const statusCode = HttpStatus.NOT_FOUND;
    const message = `${elementName} not found`;
    super(message, statusCode);
  }

  getData() {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
