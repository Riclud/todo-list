import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, Length } from 'class-validator';

export class CreateTodoFolderDto {
  @ApiProperty({ example: 'Shopping list', description: 'Folder name' })
  @IsString()
  @Length(1, 20)
  name: string;
}

export class UpdateTodoFolderDto {
  @ApiProperty({
    example: '5cfcc81b-324f-492f-beab-5246d6e27cb8',
    description: 'Folder id',
  })
  @IsUUID('4')
  folderID: string;

  @ApiProperty({ example: 'Goal list', description: 'Folder name' })
  @IsString()
  @Length(1, 20)
  name: string;
}
