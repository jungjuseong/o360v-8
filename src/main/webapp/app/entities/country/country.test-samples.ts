import { ICountry, NewCountry } from './country.model';

export const sampleWithRequiredData: ICountry = {
  id: 15386,
  name: 'twang',
};

export const sampleWithPartialData: ICountry = {
  id: 13140,
  name: 'dew whoever',
};

export const sampleWithFullData: ICountry = {
  id: 23147,
  name: 'hm',
};

export const sampleWithNewData: NewCountry = {
  name: 'wrongly boohoo',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
