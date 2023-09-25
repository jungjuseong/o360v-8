import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../project-owner.test-samples';

import { ProjectOwnerFormService } from './project-owner-form.service';

describe('ProjectOwner Form Service', () => {
  let service: ProjectOwnerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectOwnerFormService);
  });

  describe('Service methods', () => {
    describe('createProjectOwnerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProjectOwnerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing IProjectOwner should create a new form with FormGroup', () => {
        const formGroup = service.createProjectOwnerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getProjectOwner', () => {
      it('should return NewProjectOwner for default ProjectOwner initial value', () => {
        const formGroup = service.createProjectOwnerFormGroup(sampleWithNewData);

        const projectOwner = service.getProjectOwner(formGroup) as any;

        expect(projectOwner).toMatchObject(sampleWithNewData);
      });

      it('should return NewProjectOwner for empty ProjectOwner initial value', () => {
        const formGroup = service.createProjectOwnerFormGroup();

        const projectOwner = service.getProjectOwner(formGroup) as any;

        expect(projectOwner).toMatchObject({});
      });

      it('should return IProjectOwner', () => {
        const formGroup = service.createProjectOwnerFormGroup(sampleWithRequiredData);

        const projectOwner = service.getProjectOwner(formGroup) as any;

        expect(projectOwner).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProjectOwner should not enable id FormControl', () => {
        const formGroup = service.createProjectOwnerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProjectOwner should disable id FormControl', () => {
        const formGroup = service.createProjectOwnerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
