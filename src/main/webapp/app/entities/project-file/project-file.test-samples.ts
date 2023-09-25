import { IProjectFile, NewProjectFile } from './project-file.model';

export const sampleWithRequiredData: IProjectFile = {
  id: 21541,
  file: '../fake-data/blob/hipster.png',
  fileContentType: 'unknown',
  name: 'alongside telescope coach',
};

export const sampleWithPartialData: IProjectFile = {
  id: 5966,
  file: '../fake-data/blob/hipster.png',
  fileContentType: 'unknown',
  name: 'er defend',
};

export const sampleWithFullData: IProjectFile = {
  id: 27130,
  file: '../fake-data/blob/hipster.png',
  fileContentType: 'unknown',
  name: 'shawl when shape',
};

export const sampleWithNewData: NewProjectFile = {
  file: '../fake-data/blob/hipster.png',
  fileContentType: 'unknown',
  name: 'past',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
