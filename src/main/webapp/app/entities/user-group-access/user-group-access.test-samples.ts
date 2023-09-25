import { IUserGroupAccess, NewUserGroupAccess } from './user-group-access.model';

export const sampleWithRequiredData: IUserGroupAccess = {
  id: 7605,
};

export const sampleWithPartialData: IUserGroupAccess = {
  id: 13700,
};

export const sampleWithFullData: IUserGroupAccess = {
  id: 21406,
};

export const sampleWithNewData: NewUserGroupAccess = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
