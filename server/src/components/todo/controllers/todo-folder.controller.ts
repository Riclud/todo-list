import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { User } from '../../../core/auth/decorators/user.decorator';
import { jwtPayloadType } from '../../../core/auth/types/jwt-payload.type';
import { TodoFolderService } from '../services/todo-folder.service';
import { ElementCreate, OK } from '../../../core/global.responses';
import {
  CreateTodoFolderDto,
  UpdateTodoFolderDto,
} from '../dto/todo-folder.dto';
import {
  TodoFoldersResponse,
  TodoFolderResponse,
} from '../responses/todo-folder.responses';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  UnauthorizedException,
  ElementNotFound,
  AccessErrorException,
} from '../../../core/global.exceptions';

@Controller('todo/folder')
@ApiTags('Todo folder')
export class TodoFolderController {
  constructor(private todoFolderService: TodoFolderService) {}

  @Get()
  @ApiOperation({ summary: 'Get all folders' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: TodoFoldersResponse, isArray: true })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async getAll(@User() user: jwtPayloadType) {
    return new TodoFoldersResponse(
      await this.todoFolderService.getAll(user.id),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get folder by ID' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: TodoFolderResponse })
  @ApiResponse({ type: ElementNotFound, status: HttpStatus.NOT_FOUND })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async getByID(
    @User() user: jwtPayloadType,
    @Param('id', ParseUUIDPipe) folderID: string,
  ) {
    return new TodoFolderResponse(
      await this.todoFolderService.getByID(user.id, folderID),
    );
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Create folder' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: ElementCreate })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async create(
    @User() user: jwtPayloadType,
    @Body() createTodoFolderDto: CreateTodoFolderDto,
  ) {
    const { name } = createTodoFolderDto;
    const { id: folderID } = await this.todoFolderService.create(user.id, name);
    return new ElementCreate(folderID);
  }

  @Put()
  @HttpCode(200)
  @ApiOperation({ summary: 'Update folder' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: OK })
  @ApiResponse({ type: AccessErrorException, status: HttpStatus.BAD_REQUEST })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async update(
    @User() user: jwtPayloadType,
    @Body() updateTodoFolderDto: UpdateTodoFolderDto,
  ) {
    const { name, folderID } = updateTodoFolderDto;
    await this.todoFolderService.update(user.id, folderID, name);
    return new OK();
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete folder' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: OK })
  @ApiResponse({ type: AccessErrorException, status: HttpStatus.BAD_REQUEST })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async delete(
    @User() user: jwtPayloadType,
    @Param('id', ParseUUIDPipe) folderID: string,
  ) {
    await this.todoFolderService.delete(user.id, folderID);
    return new OK();
  }
}
