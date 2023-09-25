import { IUserGroup, NewUserGroup } from './user-group.model';

export const sampleWithRequiredData: IUserGroup = {
  id: 1385,
  name: 'fence attorney gadzooks',
};

export const sampleWithPartialData: IUserGroup = {
  id: 26143,
  name: 'yahoo pat grumpy',
};

export const sampleWithFullData: IUserGroup = {
  id: 32237,
  name: 'off',
};

export const sampleWithNewData: NewUserGroup = {
  name: 'why',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
