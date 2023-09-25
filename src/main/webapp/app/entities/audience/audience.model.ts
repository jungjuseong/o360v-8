import { IBrand } from 'app/entities/brand/brand.model';

export interface IAudience {
  id: number;
  brand?: Pick<IBrand, 'id' | 'name'> | null;
}

export type NewAudience = Omit<IAudience, 'id'> & { id: null };
