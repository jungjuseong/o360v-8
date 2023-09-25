import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../stakeholder-comment.test-samples';

import { StakeholderCommentFormService } from './stakeholder-comment-form.service';

describe('StakeholderComment Form Service', () => {
  let service: StakeholderCommentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StakeholderCommentFormService);
  });

  describe('Service methods', () => {
    describe('createStakeholderCommentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStakeholderCommentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            createdDate: expect.any(Object),
            comment: expect.any(Object),
            user: expect.any(Object),
            stakeholder: expect.any(Object),
          }),
        );
      });

      it('passing IStakeholderComment should create a new form with FormGroup', () => {
        const formGroup = service.createStakeholderCommentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            createdDate: expect.any(Object),
            comment: expect.any(Object),
            user: expect.any(Object),
            stakeholder: expect.any(Object),
          }),
        );
      });
    });

    describe('getStakeholderComment', () => {
      it('should return NewStakeholderComment for default StakeholderComment initial value', () => {
        const formGroup = service.createStakeholderCommentFormGroup(sampleWithNewData);

        const stakeholderComment = service.getStakeholderComment(formGroup) as any;

        expect(stakeholderComment).toMatchObject(sampleWithNewData);
      });

      it('should return NewStakeholderComment for empty StakeholderComment initial value', () => {
        const formGroup = service.createStakeholderCommentFormGroup();

        const stakeholderComment = service.getStakeholderComment(formGroup) as any;

        expect(stakeholderComment).toMatchObject({});
      });

      it('should return IStakeholderComment', () => {
        const formGroup = service.createStakeholderCommentFormGroup(sampleWithRequiredData);

        const stakeholderComment = service.getStakeholderComment(formGroup) as any;

        expect(stakeholderComment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStakeholderComment should not enable id FormControl', () => {
        const formGroup = service.createStakeholderCommentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStakeholderComment should disable id FormControl', () => {
        const formGroup = service.createStakeholderCommentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
