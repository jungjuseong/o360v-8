import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../account-number.test-samples';

import { AccountNumberFormService } from './account-number-form.service';

describe('AccountNumber Form Service', () => {
  let service: AccountNumberFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountNumberFormService);
  });

  describe('Service methods', () => {
    describe('createAccountNumberFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAccountNumberFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            accountNumber: expect.any(Object),
          }),
        );
      });

      it('passing IAccountNumber should create a new form with FormGroup', () => {
        const formGroup = service.createAccountNumberFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            accountNumber: expect.any(Object),
          }),
        );
      });
    });

    describe('getAccountNumber', () => {
      it('should return NewAccountNumber for default AccountNumber initial value', () => {
        const formGroup = service.createAccountNumberFormGroup(sampleWithNewData);

        const accountNumber = service.getAccountNumber(formGroup) as any;

        expect(accountNumber).toMatchObject(sampleWithNewData);
      });

      it('should return NewAccountNumber for empty AccountNumber initial value', () => {
        const formGroup = service.createAccountNumberFormGroup();

        const accountNumber = service.getAccountNumber(formGroup) as any;

        expect(accountNumber).toMatchObject({});
      });

      it('should return IAccountNumber', () => {
        const formGroup = service.createAccountNumberFormGroup(sampleWithRequiredData);

        const accountNumber = service.getAccountNumber(formGroup) as any;

        expect(accountNumber).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAccountNumber should not enable id FormControl', () => {
        const formGroup = service.createAccountNumberFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAccountNumber should disable id FormControl', () => {
        const formGroup = service.createAccountNumberFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
