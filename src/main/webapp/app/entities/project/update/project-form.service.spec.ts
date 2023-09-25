import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../project.test-samples';

import { ProjectFormService } from './project-form.service';

describe('Project Form Service', () => {
  let service: ProjectFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectFormService);
  });

  describe('Service methods', () => {
    describe('createProjectFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createProjectFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            title: expect.any(Object),
            fiscalYear: expect.any(Object),
            budget: expect.any(Object),
            createdDate: expect.any(Object),
            startDate: expect.any(Object),
            deploymentDate: expect.any(Object),
            endDate: expect.any(Object),
            description: expect.any(Object),
            poNumber: expect.any(Object),
            jiraCode: expect.any(Object),
            jiraUpdate: expect.any(Object),
            projectStatus: expect.any(Object),
            projectFinancialStatus: expect.any(Object),
            countries: expect.any(Object),
            parentProject: expect.any(Object),
            goal: expect.any(Object),
            channel: expect.any(Object),
            costCenter: expect.any(Object),
            accountNumber: expect.any(Object),
            projectOwner: expect.any(Object),
          }),
        );
      });

      it('passing IProject should create a new form with FormGroup', () => {
        const formGroup = service.createProjectFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            title: expect.any(Object),
            fiscalYear: expect.any(Object),
            budget: expect.any(Object),
            createdDate: expect.any(Object),
            startDate: expect.any(Object),
            deploymentDate: expect.any(Object),
            endDate: expect.any(Object),
            description: expect.any(Object),
            poNumber: expect.any(Object),
            jiraCode: expect.any(Object),
            jiraUpdate: expect.any(Object),
            projectStatus: expect.any(Object),
            projectFinancialStatus: expect.any(Object),
            countries: expect.any(Object),
            parentProject: expect.any(Object),
            goal: expect.any(Object),
            channel: expect.any(Object),
            costCenter: expect.any(Object),
            accountNumber: expect.any(Object),
            projectOwner: expect.any(Object),
          }),
        );
      });
    });

    describe('getProject', () => {
      it('should return NewProject for default Project initial value', () => {
        const formGroup = service.createProjectFormGroup(sampleWithNewData);

        const project = service.getProject(formGroup) as any;

        expect(project).toMatchObject(sampleWithNewData);
      });

      it('should return NewProject for empty Project initial value', () => {
        const formGroup = service.createProjectFormGroup();

        const project = service.getProject(formGroup) as any;

        expect(project).toMatchObject({});
      });

      it('should return IProject', () => {
        const formGroup = service.createProjectFormGroup(sampleWithRequiredData);

        const project = service.getProject(formGroup) as any;

        expect(project).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IProject should not enable id FormControl', () => {
        const formGroup = service.createProjectFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewProject should disable id FormControl', () => {
        const formGroup = service.createProjectFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
