import { ICostCenter, NewCostCenter } from './cost-center.model';

export const sampleWithRequiredData: ICostCenter = {
  id: 17673,
  costCenter: 'vacantly',
};

export const sampleWithPartialData: ICostCenter = {
  id: 7892,
  costCenter: 'unpleasant minimalism',
};

export const sampleWithFullData: ICostCenter = {
  id: 32597,
  costCenter: 'how purport',
};

export const sampleWithNewData: NewCostCenter = {
  costCenter: 'wisely incidentally',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
