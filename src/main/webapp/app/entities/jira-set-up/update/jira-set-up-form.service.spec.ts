import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../jira-set-up.test-samples';

import { JiraSetUpFormService } from './jira-set-up-form.service';

describe('JiraSetUp Form Service', () => {
  let service: JiraSetUpFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JiraSetUpFormService);
  });

  describe('Service methods', () => {
    describe('createJiraSetUpFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJiraSetUpFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            url: expect.any(Object),
            apiKey: expect.any(Object),
            project: expect.any(Object),
          }),
        );
      });

      it('passing IJiraSetUp should create a new form with FormGroup', () => {
        const formGroup = service.createJiraSetUpFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            url: expect.any(Object),
            apiKey: expect.any(Object),
            project: expect.any(Object),
          }),
        );
      });
    });

    describe('getJiraSetUp', () => {
      it('should return NewJiraSetUp for default JiraSetUp initial value', () => {
        const formGroup = service.createJiraSetUpFormGroup(sampleWithNewData);

        const jiraSetUp = service.getJiraSetUp(formGroup) as any;

        expect(jiraSetUp).toMatchObject(sampleWithNewData);
      });

      it('should return NewJiraSetUp for empty JiraSetUp initial value', () => {
        const formGroup = service.createJiraSetUpFormGroup();

        const jiraSetUp = service.getJiraSetUp(formGroup) as any;

        expect(jiraSetUp).toMatchObject({});
      });

      it('should return IJiraSetUp', () => {
        const formGroup = service.createJiraSetUpFormGroup(sampleWithRequiredData);

        const jiraSetUp = service.getJiraSetUp(formGroup) as any;

        expect(jiraSetUp).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJiraSetUp should not enable id FormControl', () => {
        const formGroup = service.createJiraSetUpFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJiraSetUp should disable id FormControl', () => {
        const formGroup = service.createJiraSetUpFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
