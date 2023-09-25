import { IJiraSetUp, NewJiraSetUp } from './jira-set-up.model';

export const sampleWithRequiredData: IJiraSetUp = {
  id: 1006,
  url: 'https://real-dill.biz',
  apiKey: 'upon conscious',
  project: 'declaration tenderize',
};

export const sampleWithPartialData: IJiraSetUp = {
  id: 2654,
  url: 'https://unlucky-island.biz/',
  apiKey: 'blindly fray gifted',
  project: 'hopelessly vainly indeed',
};

export const sampleWithFullData: IJiraSetUp = {
  id: 26585,
  url: 'https://hot-helmet.com',
  apiKey: 'upon pace ketch',
  project: 'arctic hence',
};

export const sampleWithNewData: NewJiraSetUp = {
  url: 'https://bitter-gong.org/',
  apiKey: 'ew',
  project: 'lazily until pave',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
