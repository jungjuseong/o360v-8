export interface IArea {
  id: number;
  name?: string | null;
}

export type NewArea = Omit<IArea, 'id'> & { id: null };
