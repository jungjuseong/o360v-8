import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../cost-center.test-samples';

import { CostCenterFormService } from './cost-center-form.service';

describe('CostCenter Form Service', () => {
  let service: CostCenterFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CostCenterFormService);
  });

  describe('Service methods', () => {
    describe('createCostCenterFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCostCenterFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            costCenter: expect.any(Object),
          }),
        );
      });

      it('passing ICostCenter should create a new form with FormGroup', () => {
        const formGroup = service.createCostCenterFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            costCenter: expect.any(Object),
          }),
        );
      });
    });

    describe('getCostCenter', () => {
      it('should return NewCostCenter for default CostCenter initial value', () => {
        const formGroup = service.createCostCenterFormGroup(sampleWithNewData);

        const costCenter = service.getCostCenter(formGroup) as any;

        expect(costCenter).toMatchObject(sampleWithNewData);
      });

      it('should return NewCostCenter for empty CostCenter initial value', () => {
        const formGroup = service.createCostCenterFormGroup();

        const costCenter = service.getCostCenter(formGroup) as any;

        expect(costCenter).toMatchObject({});
      });

      it('should return ICostCenter', () => {
        const formGroup = service.createCostCenterFormGroup(sampleWithRequiredData);

        const costCenter = service.getCostCenter(formGroup) as any;

        expect(costCenter).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICostCenter should not enable id FormControl', () => {
        const formGroup = service.createCostCenterFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCostCenter should disable id FormControl', () => {
        const formGroup = service.createCostCenterFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
