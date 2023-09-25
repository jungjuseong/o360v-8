import { IAccountNumber, NewAccountNumber } from './account-number.model';

export const sampleWithRequiredData: IAccountNumber = {
  id: 4457,
  accountNumber: 'blueberry zipper rudely',
};

export const sampleWithPartialData: IAccountNumber = {
  id: 28258,
  accountNumber: 'while bouncy',
};

export const sampleWithFullData: IAccountNumber = {
  id: 29279,
  accountNumber: 'sundial whoa until',
};

export const sampleWithNewData: NewAccountNumber = {
  accountNumber: 'need skim zowie',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
