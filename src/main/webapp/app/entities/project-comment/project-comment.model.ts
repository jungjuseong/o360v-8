import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IProject } from 'app/entities/project/project.model';

export interface IProjectComment {
  id: number;
  createdDate?: dayjs.Dayjs | null;
  comment?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  project?: Pick<IProject, 'id' | 'title'> | null;
}

export type NewProjectComment = Omit<IProjectComment, 'id'> & { id: null };
