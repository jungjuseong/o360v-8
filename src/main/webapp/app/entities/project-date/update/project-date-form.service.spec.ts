import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../project-date.test-samples';

import { ProjectDateFormService } from './project-date-form.service';

describe('ProjectDate Form Service', () => {
  let service: ProjectDateFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectDateFormService);
  });

  describe('Service methods', () => {
    describe('createProjectDateFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProjectDateFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            projectDateType: expect.any(Object),
            project: expect.any(Object),
          }),
        );
      });

      it('passing IProjectDate should create a new form with FormGroup', () => {
        const formGroup = service.createProjectDateFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            date: expect.any(Object),
            projectDateType: expect.any(Object),
            project: expect.any(Object),
          }),
        );
      });
    });

    describe('getProjectDate', () => {
      it('should return NewProjectDate for default ProjectDate initial value', () => {
        const formGroup = service.createProjectDateFormGroup(sampleWithNewData);

        const projectDate = service.getProjectDate(formGroup) as any;

        expect(projectDate).toMatchObject(sampleWithNewData);
      });

      it('should return NewProjectDate for empty ProjectDate initial value', () => {
        const formGroup = service.createProjectDateFormGroup();

        const projectDate = service.getProjectDate(formGroup) as any;

        expect(projectDate).toMatchObject({});
      });

      it('should return IProjectDate', () => {
        const formGroup = service.createProjectDateFormGroup(sampleWithRequiredData);

        const projectDate = service.getProjectDate(formGroup) as any;

        expect(projectDate).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProjectDate should not enable id FormControl', () => {
        const formGroup = service.createProjectDateFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProjectDate should disable id FormControl', () => {
        const formGroup = service.createProjectDateFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
