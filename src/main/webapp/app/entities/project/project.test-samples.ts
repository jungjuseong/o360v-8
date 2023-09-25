import dayjs from 'dayjs/esm';

import { IProject, NewProject } from './project.model';

export const sampleWithRequiredData: IProject = {
  id: 29734,
  code: 'loosely unity third',
  title: 'athwart pocket',
  fiscalYear: dayjs('2023-09-16'),
  budget: 12990.24,
  createdDate: dayjs('2023-09-16'),
  startDate: dayjs('2023-09-17'),
  deploymentDate: dayjs('2023-09-17'),
  endDate: dayjs('2023-09-16'),
  poNumber: 'fruitful supposing whoa',
};

export const sampleWithPartialData: IProject = {
  id: 8232,
  code: 'finish smooth',
  title: 'firewall',
  fiscalYear: dayjs('2023-09-17'),
  budget: 12175.61,
  createdDate: dayjs('2023-09-17'),
  startDate: dayjs('2023-09-16'),
  deploymentDate: dayjs('2023-09-17'),
  endDate: dayjs('2023-09-16'),
  poNumber: 'beautifully meh',
  jiraCode: 'clumsy stereo',
  jiraUpdate: dayjs('2023-09-17'),
};

export const sampleWithFullData: IProject = {
  id: 18763,
  code: 'past ensue whoa',
  title: 'yuck while',
  fiscalYear: dayjs('2023-09-17'),
  budget: 17451,
  createdDate: dayjs('2023-09-16'),
  startDate: dayjs('2023-09-16'),
  deploymentDate: dayjs('2023-09-17'),
  endDate: dayjs('2023-09-16'),
  description: 'courageously',
  poNumber: 'near',
  jiraCode: 'a ugh persist',
  jiraUpdate: dayjs('2023-09-16'),
  projectStatus: 'COMPLETED',
  projectFinancialStatus: 'GOOD',
};

export const sampleWithNewData: NewProject = {
  code: 'vast',
  title: 'provided',
  fiscalYear: dayjs('2023-09-16'),
  budget: 7357.62,
  createdDate: dayjs('2023-09-16'),
  startDate: dayjs('2023-09-16'),
  deploymentDate: dayjs('2023-09-16'),
  endDate: dayjs('2023-09-16'),
  poNumber: 'whether',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
