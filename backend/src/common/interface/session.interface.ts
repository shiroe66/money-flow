import { User } from '@app/models/users/entities/user.entity';

export interface Session {
  refresh_token: string;
  exp: number;
  user: User;
}
