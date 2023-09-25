export interface IProjectOwner {
  id: number;
  name?: string | null;
}

export type NewProjectOwner = Omit<IProjectOwner, 'id'> & { id: null };
