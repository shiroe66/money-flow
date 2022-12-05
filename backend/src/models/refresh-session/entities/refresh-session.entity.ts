import { User } from '@app/models/users/entities/user.entity';
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}
