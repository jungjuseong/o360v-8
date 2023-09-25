import { IArea } from 'app/entities/area/area.model';

export interface IBrand {
  id: number;
  name?: string | null;
  area?: Pick<IArea, 'id' | 'name'> | null;
}

export type NewBrand = Omit<IBrand, 'id'> & { id: null };
