import { ApiProperty } from '@nestjs/swagger';

export class TaskFileType {
  @ApiProperty({ example: 'c109c794-f76f-450e-b1b2-4e9f5074700a' })
  id: string;
  @ApiProperty({ example: 'image/jpeg' })
  type: string;
  @ApiProperty({ example: '1634769139931.jpeg' })
  link: string;
}
