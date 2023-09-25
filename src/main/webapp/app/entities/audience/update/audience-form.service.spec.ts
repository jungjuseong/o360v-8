import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../audience.test-samples';

import { AudienceFormService } from './audience-form.service';

describe('Audience Form Service', () => {
  let service: AudienceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudienceFormService);
  });

  describe('Service methods', () => {
    describe('createAudienceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAudienceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            brand: expect.any(Object),
          }),
        );
      });

      it('passing IAudience should create a new form with FormGroup', () => {
        const formGroup = service.createAudienceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            brand: expect.any(Object),
          }),
        );
      });
    });

    describe('getAudience', () => {
      it('should return NewAudience for default Audience initial value', () => {
        const formGroup = service.createAudienceFormGroup(sampleWithNewData);

        const audience = service.getAudience(formGroup) as any;

        expect(audience).toMatchObject(sampleWithNewData);
      });

      it('should return NewAudience for empty Audience initial value', () => {
        const formGroup = service.createAudienceFormGroup();

        const audience = service.getAudience(formGroup) as any;

        expect(audience).toMatchObject({});
      });

      it('should return IAudience', () => {
        const formGroup = service.createAudienceFormGroup(sampleWithRequiredData);

        const audience = service.getAudience(formGroup) as any;

        expect(audience).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAudience should not enable id FormControl', () => {
        const formGroup = service.createAudienceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAudience should disable id FormControl', () => {
        const formGroup = service.createAudienceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
