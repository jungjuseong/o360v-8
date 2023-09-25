import { IArea, NewArea } from './area.model';

export const sampleWithRequiredData: IArea = {
  id: 15315,
  name: 'but',
};

export const sampleWithPartialData: IArea = {
  id: 5726,
  name: 'woozy tablecloth essential',
};

export const sampleWithFullData: IArea = {
  id: 3009,
  name: 'variation decent',
};

export const sampleWithNewData: NewArea = {
  name: 'corrupt cheery likewise',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
