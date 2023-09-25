import { IProjectOwner, NewProjectOwner } from './project-owner.model';

export const sampleWithRequiredData: IProjectOwner = {
  id: 7179,
  name: 'er around dart',
};

export const sampleWithPartialData: IProjectOwner = {
  id: 12384,
  name: 'pie skin apropos',
};

export const sampleWithFullData: IProjectOwner = {
  id: 19317,
  name: 'idolized thunderous impose',
};

export const sampleWithNewData: NewProjectOwner = {
  name: 'pro',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
