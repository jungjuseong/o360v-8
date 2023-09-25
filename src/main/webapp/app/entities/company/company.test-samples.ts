import { ICompany, NewCompany } from './company.model';

export const sampleWithRequiredData: ICompany = {
  id: 5217,
  name: 'detach',
};

export const sampleWithPartialData: ICompany = {
  id: 3134,
  name: 'properly acidly',
};

export const sampleWithFullData: ICompany = {
  id: 4907,
  name: 'frenetically solemnly',
  logo: '../fake-data/blob/hipster.png',
  logoContentType: 'unknown',
};

export const sampleWithNewData: NewCompany = {
  name: 'astride',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
