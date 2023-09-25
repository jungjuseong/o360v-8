import { IUser } from 'app/entities/user/user.model';

export interface ICompany {
  id: number;
  name?: string | null;
  logo?: string | null;
  logoContentType?: string | null;
  users?: Pick<IUser, 'id' | 'login'>[] | null;
}

export type NewCompany = Omit<ICompany, 'id'> & { id: null };
