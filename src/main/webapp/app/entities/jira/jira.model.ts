export interface IJira {
  id: number;
  url?: string | null;
  apiKey?: string | null;
  project?: string | null;
}

export type NewJira = Omit<IJira, 'id'> & { id: null };
