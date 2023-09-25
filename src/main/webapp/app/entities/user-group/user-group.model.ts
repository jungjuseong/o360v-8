import { IUser } from 'app/entities/user/user.model';

export interface IUserGroup {
  id: number;
  name?: string | null;
  users?: Pick<IUser, 'id' | 'login'>[] | null;
}

export type NewUserGroup = Omit<IUserGroup, 'id'> & { id: null };
