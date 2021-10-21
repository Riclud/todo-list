import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({ example: '5cfcc81b-324f-492f-beab-5246d6e27cb8' })
  @IsUUID('4')
  taskID: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsNotEmpty()
  file: any;
}
