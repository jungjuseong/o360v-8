export interface IProjectGoal {
  id: number;
  name?: string | null;
  projectCompletion?: number | null;
  projectCompletionBurnRate?: number | null;
}

export type NewProjectGoal = Omit<IProjectGoal, 'id'> & { id: null };
