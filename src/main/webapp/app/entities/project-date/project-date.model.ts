import dayjs from 'dayjs/esm';
import { IProject } from 'app/entities/project/project.model';
import { ProjectDateType } from 'app/entities/enumerations/project-date-type.model';

export interface IProjectDate {
  id: number;
  date?: dayjs.Dayjs | null;
  projectDateType?: keyof typeof ProjectDateType | null;
  project?: Pick<IProject, 'id' | 'code'> | null;
}

export type NewProjectDate = Omit<IProjectDate, 'id'> & { id: null };
