import { IAudience, NewAudience } from './audience.model';

export const sampleWithRequiredData: IAudience = {
  id: 23772,
};

export const sampleWithPartialData: IAudience = {
  id: 12890,
};

export const sampleWithFullData: IAudience = {
  id: 32128,
};

export const sampleWithNewData: NewAudience = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
