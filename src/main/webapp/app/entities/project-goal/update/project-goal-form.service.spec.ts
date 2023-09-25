import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../project-goal.test-samples';

import { ProjectGoalFormService } from './project-goal-form.service';

describe('ProjectGoal Form Service', () => {
  let service: ProjectGoalFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectGoalFormService);
  });

  describe('Service methods', () => {
    describe('createProjectGoalFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProjectGoalFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            projectCompletion: expect.any(Object),
            projectCompletionBurnRate: expect.any(Object),
          }),
        );
      });

      it('passing IProjectGoal should create a new form with FormGroup', () => {
        const formGroup = service.createProjectGoalFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            projectCompletion: expect.any(Object),
            projectCompletionBurnRate: expect.any(Object),
          }),
        );
      });
    });

    describe('getProjectGoal', () => {
      it('should return NewProjectGoal for default ProjectGoal initial value', () => {
        const formGroup = service.createProjectGoalFormGroup(sampleWithNewData);

        const projectGoal = service.getProjectGoal(formGroup) as any;

        expect(projectGoal).toMatchObject(sampleWithNewData);
      });

      it('should return NewProjectGoal for empty ProjectGoal initial value', () => {
        const formGroup = service.createProjectGoalFormGroup();

        const projectGoal = service.getProjectGoal(formGroup) as any;

        expect(projectGoal).toMatchObject({});
      });

      it('should return IProjectGoal', () => {
        const formGroup = service.createProjectGoalFormGroup(sampleWithRequiredData);

        const projectGoal = service.getProjectGoal(formGroup) as any;

        expect(projectGoal).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProjectGoal should not enable id FormControl', () => {
        const formGroup = service.createProjectGoalFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProjectGoal should disable id FormControl', () => {
        const formGroup = service.createProjectGoalFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
