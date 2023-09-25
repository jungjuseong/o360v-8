import { IJira, NewJira } from './jira.model';

export const sampleWithRequiredData: IJira = {
  id: 18654,
  url: 'https://excited-cobweb.name/',
  apiKey: 'grand immediate apropos',
  project: 'enchanting layer',
};

export const sampleWithPartialData: IJira = {
  id: 25896,
  url: 'https://starchy-weather.info',
  apiKey: 'cute yum damp',
  project: 'before uh-huh',
};

export const sampleWithFullData: IJira = {
  id: 21959,
  url: 'https://gripping-asterisk.net',
  apiKey: 'cape since',
  project: 'molasses positively when',
};

export const sampleWithNewData: NewJira = {
  url: 'https://agitated-fort.info',
  apiKey: 'burdensome zowie carefully',
  project: 'colorfully eek circa',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
