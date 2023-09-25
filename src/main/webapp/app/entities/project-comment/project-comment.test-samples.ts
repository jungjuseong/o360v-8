import dayjs from 'dayjs/esm';

import { IProjectComment, NewProjectComment } from './project-comment.model';

export const sampleWithRequiredData: IProjectComment = {
  id: 27112,
  createdDate: dayjs('2023-09-16'),
  comment: '../fake-data/blob/hipster.txt',
};

export const sampleWithPartialData: IProjectComment = {
  id: 618,
  createdDate: dayjs('2023-09-16'),
  comment: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IProjectComment = {
  id: 3835,
  createdDate: dayjs('2023-09-16'),
  comment: '../fake-data/blob/hipster.txt',
};

export const sampleWithNewData: NewProjectComment = {
  createdDate: dayjs('2023-09-16'),
  comment: '../fake-data/blob/hipster.txt',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
