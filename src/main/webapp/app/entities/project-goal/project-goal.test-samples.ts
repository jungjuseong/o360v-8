import { IProjectGoal, NewProjectGoal } from './project-goal.model';

export const sampleWithRequiredData: IProjectGoal = {
  id: 6258,
  name: 'aside caviar',
};

export const sampleWithPartialData: IProjectGoal = {
  id: 13150,
  name: 'suddenly',
  projectCompletion: 6905,
  projectCompletionBurnRate: 24231,
};

export const sampleWithFullData: IProjectGoal = {
  id: 11307,
  name: 'down oof',
  projectCompletion: 1587,
  projectCompletionBurnRate: 32461,
};

export const sampleWithNewData: NewProjectGoal = {
  name: 'frank auditorium liquidity',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
