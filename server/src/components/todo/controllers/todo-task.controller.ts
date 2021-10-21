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
import { TodoTaskService } from '../services/todo-task.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { ElementCreate, OK } from '../../../core/global.responses';
import { User } from '../../../core/auth/decorators/user.decorator';
import { jwtPayloadType } from '../../../core/auth/types/jwt-payload.type';
import { CreateTodoTaskDto, UpdateTodoTaskDto } from '../dto/todo-task.dto';
import { TodoTaskResponse } from '../responses/todo-task.responses';
import {
  UnauthorizedException,
  ElementNotFound,
  AccessErrorException,
} from '../../../core/global.exceptions';
import { TodoTaskType } from '../types/todo-task.type';

@Controller('todo/task')
@ApiTags('Todo task')
export class TodoTaskController {
  constructor(private todoTaskService: TodoTaskService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: TodoTaskType })
  @ApiResponse({ type: ElementNotFound, status: HttpStatus.NOT_FOUND })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async getByID(
    @User() user: jwtPayloadType,
    @Param('id', ParseUUIDPipe) taskID: string,
  ) {
    return new TodoTaskResponse(
      await this.todoTaskService.getByID(user.id, taskID),
    );
  }

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Create task' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: ElementCreate })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async create(
    @User() user: jwtPayloadType,
    @Body() createTodoTaskDto: CreateTodoTaskDto,
  ) {
    const { id: taskID } = await this.todoTaskService.create(
      user.id,
      createTodoTaskDto,
    );
    return new ElementCreate(taskID);
  }

  @Put()
  @HttpCode(200)
  @ApiOperation({ summary: 'Update task' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: OK })
  @ApiResponse({ type: AccessErrorException, status: HttpStatus.BAD_REQUEST })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async update(
    @User() user: jwtPayloadType,
    @Body() updateTodoTaskDto: UpdateTodoTaskDto,
  ) {
    await this.todoTaskService.update(user.id, updateTodoTaskDto);
    return new OK();
  }

  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete  task' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: OK })
  @ApiResponse({ type: AccessErrorException, status: HttpStatus.BAD_REQUEST })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async delete(
    @User() user: jwtPayloadType,
    @Param('id', ParseUUIDPipe) taskID: string,
  ) {
    await this.todoTaskService.delete(user.id, taskID);
    return new OK();
  }
}
