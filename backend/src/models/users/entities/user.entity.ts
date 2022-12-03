import { RefreshSession } from '@app/models/refresh-session/entities/refresh-session.entity';
import * as argon2 from 'argon2';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
@Unique(['email', 'username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  username: string;

  @Exclude()
  @Column({ type: 'text' })
  password: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @Column({ type: 'text', default: null })
  image: string | null;

  @Column({ type: 'text' })
  country: string;

  @Column({ type: 'text' })
  city: string;

  @Column({ type: 'varchar' })
  currency: string;

  @OneToMany(() => RefreshSession, (refreshSession) => refreshSession.user)
  refresh_sessions: RefreshSession[];

  @BeforeInsert()
  async hash() {
    this.password = await argon2.hash(this.password);
  }

  async validatePassword(password: string) {
    return argon2.verify(this.password, password);
  }
}
