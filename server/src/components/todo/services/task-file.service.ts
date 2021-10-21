import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskFileEntity } from '../entites/task-file.entity';
import { AccessErrorException } from '../../../core/global.exceptions';
import { unlinkSync } from 'fs';

@Injectable()
export class TaskFileService {
  constructor(
    @InjectRepository(TaskFileEntity)
    private taskFileRepository: Repository<TaskFileEntity>,
  ) {}

  async create(
    userID: string,
    link: string,
    type: string,
    taskID: string,
  ): Promise<{ id: string }> {
    const result = await this.taskFileRepository.insert({
      userID,
      link,
      type,
      taskID,
    });

    return { id: result.raw[0].id };
  }

  async delete(userID: string, fileID: string) {
    const result = await this.taskFileRepository.findOne({
      userID,
      id: fileID,
    });

    if (!result) {
      throw new AccessErrorException();
    }

    try {
      unlinkSync(`./upload/${result.link}`);
    } catch (error) {}

    await this.taskFileRepository.delete({ userID, id: fileID });

    return true;
  }
}
