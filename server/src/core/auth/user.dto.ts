import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const minLoginLength = 6;
const maxLoginLength = 20;

const minPasswordLength = 8;
const maxPasswordLength = 64;

export class CreateUserDto {
  @ApiProperty({ example: 'riclud@gmail.com', description: 'email' })
  @IsString()
  @IsEmail()
  @Length(minLoginLength, maxLoginLength)
  login: string;

  @ApiProperty({ example: 'rv}@pvS?Jz5#' })
  @IsString()
  @Length(minPasswordLength, maxPasswordLength)
  password: string;

  @ApiProperty({ example: 'rv}@pvS?Jz5#' })
  @IsString()
  @Length(minPasswordLength, maxPasswordLength)
  accept_password: string;
}

export class LoginUserDto {
  @ApiProperty({ example: 'riclud@gmail.com', description: 'email' })
  @IsString()
  @IsEmail()
  @Length(minLoginLength, maxLoginLength)
  login: string;

  @ApiProperty({ example: 'rv}@pvS?Jz5#' })
  @IsString()
  @Length(minPasswordLength, maxPasswordLength)
  password: string;
}

export class RestoreUserDto {
  @ApiProperty({ example: 'riclud@gmail.com', description: 'email' })
  @IsString()
  @IsEmail()
  @Length(minLoginLength, maxLoginLength)
  login: string;
}

export class RestoreAcceptDto {
  @ApiProperty({ example: '4718416' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'rv}@pvS?Jz5#' })
  @IsString()
  @Length(minPasswordLength, maxPasswordLength)
  password: string;

  @ApiProperty({ example: 'rv}@pvS?Jz5#' })
  @IsString()
  @Length(minPasswordLength, maxPasswordLength)
  accept_password: string;
}
