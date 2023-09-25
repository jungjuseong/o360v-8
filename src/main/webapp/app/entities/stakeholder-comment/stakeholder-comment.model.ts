import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IStakeholder } from 'app/entities/stakeholder/stakeholder.model';

export interface IStakeholderComment {
  id: number;
  createdDate?: dayjs.Dayjs | null;
  comment?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  stakeholder?: Pick<IStakeholder, 'id'> | null;
}

export type NewStakeholderComment = Omit<IStakeholderComment, 'id'> & { id: null };
