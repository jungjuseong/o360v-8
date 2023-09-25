export interface IAccountNumber {
  id: number;
  accountNumber?: string | null;
}

export type NewAccountNumber = Omit<IAccountNumber, 'id'> & { id: null };
