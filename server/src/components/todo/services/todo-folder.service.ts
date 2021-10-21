import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoFolderEntity } from '../entites/todo-folder.entity';
import { AccessErrorException } from '../../../core/global.exceptions';
import { ElementNotFound } from '../../../core/global.exceptions';

@Injectable()
export class TodoFolderService {
  constructor(
    @InjectRepository(TodoFolderEntity)
    private todoFolderRepository: Repository<TodoFolderEntity>,
  ) {}

  getAll(userID: string) {
    return this.todoFolderRepository.find({
      where: { userID },
      select: ['id', 'name'],
    });
  }

  async getByID(userID: string, folderID: string) {
    const result = await this.todoFolderRepository.findOne({
      where: { userID, id: folderID },
      select: ['id', 'name'],
      relations: ['tasks', 'tasks.files'],
    });

    if (!result) {
      throw new ElementNotFound('Folder');
    }

    return result;
  }

  async create(userID: string, name: string): Promise<{ id: string }> {
    const result = await this.todoFolderRepository.insert({ name, userID });

    return { id: result.raw[0].id };
  }

  async update(userID: string, folderID: string, name: string) {
    const result = await this.todoFolderRepository.update(
      { userID, id: folderID },
      { name },
    );
    if (!result.affected) {
      throw new AccessErrorException();
    }

    return true;
  }

  async delete(userID: string, folderID: string) {
    const result = await this.todoFolderRepository.delete({
      userID,
      id: folderID,
    });

    if (!result.affected) {
      throw new AccessErrorException();
    }

    return true;
  }
}
