import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IProject } from 'app/entities/project/project.model';
import { StakeholderType } from 'app/entities/enumerations/stakeholder-type.model';

export interface IStakeholder {
  id: number;
  createdDate?: dayjs.Dayjs | null;
  cost?: number | null;
  stakeholderType?: keyof typeof StakeholderType | null;
  users?: Pick<IUser, 'id' | 'login'>[] | null;
  project?: Pick<IProject, 'id' | 'code'> | null;
}

export type NewStakeholder = Omit<IStakeholder, 'id'> & { id: null };
