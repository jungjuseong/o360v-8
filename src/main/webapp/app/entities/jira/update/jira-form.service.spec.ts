import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../jira.test-samples';

import { JiraFormService } from './jira-form.service';

describe('Jira Form Service', () => {
  let service: JiraFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JiraFormService);
  });

  describe('Service methods', () => {
    describe('createJiraFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJiraFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            url: expect.any(Object),
            apiKey: expect.any(Object),
            project: expect.any(Object),
          }),
        );
      });

      it('passing IJira should create a new form with FormGroup', () => {
        const formGroup = service.createJiraFormGroup(sampleWithRequiredData);

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

    describe('getJira', () => {
      it('should return NewJira for default Jira initial value', () => {
        const formGroup = service.createJiraFormGroup(sampleWithNewData);

        const jira = service.getJira(formGroup) as any;

        expect(jira).toMatchObject(sampleWithNewData);
      });

      it('should return NewJira for empty Jira initial value', () => {
        const formGroup = service.createJiraFormGroup();

        const jira = service.getJira(formGroup) as any;

        expect(jira).toMatchObject({});
      });

      it('should return IJira', () => {
        const formGroup = service.createJiraFormGroup(sampleWithRequiredData);

        const jira = service.getJira(formGroup) as any;

        expect(jira).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJira should not enable id FormControl', () => {
        const formGroup = service.createJiraFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJira should disable id FormControl', () => {
        const formGroup = service.createJiraFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
