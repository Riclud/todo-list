import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsUUID, Length } from 'class-validator';

export class CreateTodoTaskDto {
  @ApiProperty({ example: 'Write a to-do list' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ example: 'Explore business trainings' })
  @IsString()
  description: string;

  @ApiProperty({ example: '5cfcc81b-324f-492f-beab-5246d6e27cb8' })
  @IsUUID('4')
  folderID: string;
}

export class UpdateTodoTaskDto {
  @ApiProperty({
    example: '5cfcc81b-324f-492f-beab-5246d6e27cb8',
    description: 'Task id',
  })
  @IsUUID('4')
  id: string;

  @ApiProperty({ example: 'Buy a car' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ example: true, description: 'Task completed or not' })
  @IsBoolean()
  сhecked: boolean;

  @ApiProperty({ example: 'Supra mk4' })
  @IsString()
  description: string;
}
