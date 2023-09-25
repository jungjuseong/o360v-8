export interface ICostCenter {
  id: number;
  costCenter?: string | null;
}

export type NewCostCenter = Omit<ICostCenter, 'id'> & { id: null };
