import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../stakeholder.test-samples';

import { StakeholderFormService } from './stakeholder-form.service';

describe('Stakeholder Form Service', () => {
  let service: StakeholderFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StakeholderFormService);
  });

  describe('Service methods', () => {
    describe('createStakeholderFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStakeholderFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            createdDate: expect.any(Object),
            cost: expect.any(Object),
            stakeholderType: expect.any(Object),
            users: expect.any(Object),
            project: expect.any(Object),
          }),
        );
      });

      it('passing IStakeholder should create a new form with FormGroup', () => {
        const formGroup = service.createStakeholderFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            createdDate: expect.any(Object),
            cost: expect.any(Object),
            stakeholderType: expect.any(Object),
            users: expect.any(Object),
            project: expect.any(Object),
          }),
        );
      });
    });

    describe('getStakeholder', () => {
      it('should return NewStakeholder for default Stakeholder initial value', () => {
        const formGroup = service.createStakeholderFormGroup(sampleWithNewData);

        const stakeholder = service.getStakeholder(formGroup) as any;

        expect(stakeholder).toMatchObject(sampleWithNewData);
      });

      it('should return NewStakeholder for empty Stakeholder initial value', () => {
        const formGroup = service.createStakeholderFormGroup();

        const stakeholder = service.getStakeholder(formGroup) as any;

        expect(stakeholder).toMatchObject({});
      });

      it('should return IStakeholder', () => {
        const formGroup = service.createStakeholderFormGroup(sampleWithRequiredData);

        const stakeholder = service.getStakeholder(formGroup) as any;

        expect(stakeholder).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStakeholder should not enable id FormControl', () => {
        const formGroup = service.createStakeholderFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStakeholder should disable id FormControl', () => {
        const formGroup = service.createStakeholderFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
