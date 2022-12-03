import { Session } from '@app/common/interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshSession } from './entities/refresh-session.entity';

@Injectable()
export class RefreshSessionService {
  constructor(
    @InjectRepository(RefreshSession)
    private refreshSessionRepository: Repository<RefreshSession>,
  ) {}

  async create(session: Session) {
    const data = this.refreshSessionRepository.create(session);
    return data.save();
  }
}
