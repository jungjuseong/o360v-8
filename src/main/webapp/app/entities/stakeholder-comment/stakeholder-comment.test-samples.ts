import dayjs from 'dayjs/esm';

import { IStakeholderComment, NewStakeholderComment } from './stakeholder-comment.model';

export const sampleWithRequiredData: IStakeholderComment = {
  id: 19830,
  createdDate: dayjs('2023-09-17'),
  comment: '../fake-data/blob/hipster.txt',
};

export const sampleWithPartialData: IStakeholderComment = {
  id: 25374,
  createdDate: dayjs('2023-09-16'),
  comment: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IStakeholderComment = {
  id: 10616,
  createdDate: dayjs('2023-09-16'),
  comment: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewStakeholderComment = {
  createdDate: dayjs('2023-09-17'),
  comment: '../fake-data/blob/hipster.txt',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
