import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestoreCodeEntity } from '../restore-code.entity';

@Injectable()
export class RestoreCodeService {
  constructor(
    @InjectRepository(RestoreCodeEntity)
    private restoreCodeRepository: Repository<RestoreCodeEntity>,
  ) {}

  private genCode() {
    const min = 0;
    const max = 999999;
    return Math.floor(Math.random() * (max - min)) + min;
  }

  get(
    type: 'ID' | 'CODE' | 'USER_ID',
    { id, code, userID }: { id?: number; code?: string; userID?: string },
  ) {
    if (type === 'ID') {
      return this.restoreCodeRepository.findOne(id);
    }

    if (type === 'CODE') {
      return this.restoreCodeRepository.findOne({ where: { code } });
    }

    if (type === 'USER_ID') {
      return this.restoreCodeRepository.findOne({ where: { userID } });
    }

    return null;
  }

  async create(userID: string) {
    const code = this.genCode();

    await this.restoreCodeRepository.insert({ code: `${code}`, userID });

    return code;
  }

  delete(id: string) {
    return this.restoreCodeRepository.delete(id);
  }
}
