import { User } from '@app/models/users/entities/user.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as argon2 from 'argon2';

@Entity({ name: 'refresh_session' })
export class RefreshSession extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  refresh_token: string;

  @Column('int')
  exp: number;

  @ManyToOne(() => User, (user) => user.refresh_sessions)
  user: User;

  @BeforeInsert()
  async hash() {
    this.refresh_token = await argon2.hash(this.refresh_token);
  }
}
