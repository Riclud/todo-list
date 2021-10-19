import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordMismatchException extends HttpException {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;
  @ApiProperty({ example: 'Password mismatch' })
  message: string;

  constructor() {
    const message = 'Password mismatch';
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

export class UserIsAlreadyRegisteredException extends HttpException {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;
  @ApiProperty({ example: 'User is already registered' })
  message: string;

  constructor() {
    const message = 'User is already registered';
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

export class UserNotFoundException extends HttpException {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;
  @ApiProperty({ example: 'User not found' })
  message: string;

  constructor() {
    const message = 'User not found';
    const statusCode = HttpStatus.BAD_REQUEST;

    super(message, statusCode);

    this.message = message;
    this.statusCode = statusCode;
  }

  getData() {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
