import { IBrand, NewBrand } from './brand.model';

export const sampleWithRequiredData: IBrand = {
  id: 18454,
  name: 'thin',
};

export const sampleWithPartialData: IBrand = {
  id: 13021,
  name: 'participate',
};

export const sampleWithFullData: IBrand = {
  id: 26124,
  name: 'thorough um',
};

export const sampleWithNewData: NewBrand = {
  name: 'about',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
