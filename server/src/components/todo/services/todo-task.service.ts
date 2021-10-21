import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoTaskDto, UpdateTodoTaskDto } from '../dto/todo-task.dto';
import { TodoTaskEntity } from '../entites/todo-task.entity';
import { AccessErrorException } from '../../../core/global.exceptions';
import { ElementNotFound } from '../../../core/global.exceptions';

@Injectable()
export class TodoTaskService {
  constructor(
    @InjectRepository(TodoTaskEntity)
    private todoTaskRepository: Repository<TodoTaskEntity>,
  ) {}

  async getByID(userID: string, taskID: string) {
    const result = await this.todoTaskRepository.findOne({
      where: { userID, id: taskID },
      select: ['id', 'name', 'сhecked', 'description', 'folderID'],
      relations: ['files'],
    });

    if (!result) {
      throw new ElementNotFound('Task');
    }

    return result;
  }

  async create(
    userID: string,
    createTodoTaskDto: CreateTodoTaskDto,
  ): Promise<{ id: string }> {
    const result = await this.todoTaskRepository.insert({
      userID,
      ...createTodoTaskDto,
    });

    return { id: result.raw[0].id };
  }

  async update(userID: string, updateTodoTaskDto: UpdateTodoTaskDto) {
    const taskID = updateTodoTaskDto.id;
    delete updateTodoTaskDto.id;

    const result = await this.todoTaskRepository.update(
      { id: taskID, userID },
      { ...updateTodoTaskDto },
    );

    if (!result.affected) {
      throw new AccessErrorException();
    }

    return true;
  }

  async delete(userID: string, taskID: string) {
    const result = await this.todoTaskRepository.delete({ userID, id: taskID });

    if (!result.affected) {
      throw new AccessErrorException();
    }

    return true;
  }
}
