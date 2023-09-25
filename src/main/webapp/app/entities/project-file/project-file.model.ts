import { IProject } from 'app/entities/project/project.model';

export interface IProjectFile {
  id: number;
  file?: string | null;
  fileContentType?: string | null;
  name?: string | null;
  project?: Pick<IProject, 'id' | 'code'> | null;
}

export type NewProjectFile = Omit<IProjectFile, 'id'> & { id: null };
