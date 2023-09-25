import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../project-file.test-samples';

import { ProjectFileFormService } from './project-file-form.service';

describe('ProjectFile Form Service', () => {
  let service: ProjectFileFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectFileFormService);
  });

  describe('Service methods', () => {
    describe('createProjectFileFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProjectFileFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            file: expect.any(Object),
            name: expect.any(Object),
            project: expect.any(Object),
          }),
        );
      });

      it('passing IProjectFile should create a new form with FormGroup', () => {
        const formGroup = service.createProjectFileFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            file: expect.any(Object),
            name: expect.any(Object),
            project: expect.any(Object),
          }),
        );
      });
    });

    describe('getProjectFile', () => {
      it('should return NewProjectFile for default ProjectFile initial value', () => {
        const formGroup = service.createProjectFileFormGroup(sampleWithNewData);

        const projectFile = service.getProjectFile(formGroup) as any;

        expect(projectFile).toMatchObject(sampleWithNewData);
      });

      it('should return NewProjectFile for empty ProjectFile initial value', () => {
        const formGroup = service.createProjectFileFormGroup();

        const projectFile = service.getProjectFile(formGroup) as any;

        expect(projectFile).toMatchObject({});
      });

      it('should return IProjectFile', () => {
        const formGroup = service.createProjectFileFormGroup(sampleWithRequiredData);

        const projectFile = service.getProjectFile(formGroup) as any;

        expect(projectFile).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProjectFile should not enable id FormControl', () => {
        const formGroup = service.createProjectFileFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProjectFile should disable id FormControl', () => {
        const formGroup = service.createProjectFileFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
