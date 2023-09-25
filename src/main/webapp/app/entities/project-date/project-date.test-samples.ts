import dayjs from 'dayjs/esm';

import { IProjectDate, NewProjectDate } from './project-date.model';

export const sampleWithRequiredData: IProjectDate = {
  id: 15602,
  date: dayjs('2023-09-16'),
};

export const sampleWithPartialData: IProjectDate = {
  id: 14250,
  date: dayjs('2023-09-16'),
};

export const sampleWithFullData: IProjectDate = {
  id: 30886,
  date: dayjs('2023-09-16'),
  projectDateType: 'DATE_TYPE1',
};

export const sampleWithNewData: NewProjectDate = {
  date: dayjs('2023-09-17'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
