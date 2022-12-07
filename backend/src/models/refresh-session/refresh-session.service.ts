import { Session } from '@app/common/interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { RefreshSession } from './entities/refresh-session.entity';

@Injectable()
export class RefreshSessionService {
  constructor(
    @InjectRepository(RefreshSession)
    private refreshSessionRepository: Repository<RefreshSession>,
  ) {}

  async create(session: Session) {
    const [sessions, count] = await this.refreshSessionRepository.findAndCount({
      where: { user: { id: session.user.id } },
      order: { exp: 'ASC' },
    });

    if (count === 3) {
      const [firstSession] = sessions;
      await this.delete(firstSession.id);
    }

    const data = this.refreshSessionRepository.create(session);
    return data.save();
  }

  // проверить работу с несколькими токенами
  async verify(refreshToken: string, id: string) {
    const sessions = await this.refreshSessionRepository.find({
      where: { user: { id } },
    });

    for (const session of sessions) {
      const isValid = await argon2.verify(session.refresh_token, refreshToken);

      if (isValid) {
        return session;
      }
    }

    return null;
  }

  async delete(id: string) {
    const data = await this.refreshSessionRepository.delete(id);
    return data;
  }
}
