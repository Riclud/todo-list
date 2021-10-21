import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { TaskFileService } from '../services/task-file.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from '../../../core/auth/decorators/user.decorator';
import { jwtPayloadType } from '../../../core/auth/types/jwt-payload.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from '../dto/task-file.dto';
import { diskStorage } from 'multer';
import { ElementCreate, OK } from '../../../core/global.responses';
import {
  UnauthorizedException,
  AccessErrorException,
} from '../../../core/global.exceptions';

@Controller('todo/task/file')
@ApiTags('Todo task file')
export class TaskFileController {
  constructor(private taskFileService: TaskFileService) {}

  @Post()
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) =>
          cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`),
      }),
    }),
  )
  @ApiOperation({ summary: 'Create file task' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  @ApiOkResponse({ type: ElementCreate })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async create(
    @User() user: jwtPayloadType,
    @Body('taskID', ParseUUIDPipe) taskID: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { id: fileID } = await this.taskFileService.create(
      user.id,
      file.filename,
      file.mimetype,
      taskID,
    );

    return new ElementCreate(fileID);
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete file task' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: OK })
  @ApiResponse({ type: AccessErrorException, status: HttpStatus.BAD_REQUEST })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async delete(@User() user: jwtPayloadType, @Param('id') fileID: string) {
    await this.taskFileService.delete(user.id, fileID);
    return new OK();
  }
}
