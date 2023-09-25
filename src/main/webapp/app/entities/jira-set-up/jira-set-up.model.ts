export interface IJiraSetUp {
  id: number;
  url?: string | null;
  apiKey?: string | null;
  project?: string | null;
}

export type NewJiraSetUp = Omit<IJiraSetUp, 'id'> & { id: null };
