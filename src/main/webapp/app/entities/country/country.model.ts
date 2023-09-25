import { IProject } from 'app/entities/project/project.model';

export interface ICountry {
  id: number;
  name?: string | null;
  projects?: Pick<IProject, 'id'>[] | null;
}

export type NewCountry = Omit<ICountry, 'id'> & { id: null };
