import dayjs from 'dayjs/esm';

import { IStakeholder, NewStakeholder } from './stakeholder.model';

export const sampleWithRequiredData: IStakeholder = {
  id: 27712,
  createdDate: dayjs('2023-09-17'),
};

export const sampleWithPartialData: IStakeholder = {
  id: 10667,
  createdDate: dayjs('2023-09-16'),
  cost: 4860.49,
};

export const sampleWithFullData: IStakeholder = {
  id: 19205,
  createdDate: dayjs('2023-09-16'),
  cost: 30.43,
  stakeholderType: 'THIRD_PARTY',
};

export const sampleWithNewData: NewStakeholder = {
  createdDate: dayjs('2023-09-17'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
