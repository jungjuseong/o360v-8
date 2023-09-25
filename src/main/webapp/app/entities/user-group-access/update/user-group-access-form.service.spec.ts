import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-group-access.test-samples';

import { UserGroupAccessFormService } from './user-group-access-form.service';

describe('UserGroupAccess Form Service', () => {
  let service: UserGroupAccessFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserGroupAccessFormService);
  });

  describe('Service methods', () => {
    describe('createUserGroupAccessFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserGroupAccessFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            area: expect.any(Object),
            brand: expect.any(Object),
            audience: expect.any(Object),
            channel: expect.any(Object),
            country: expect.any(Object),
            userGroup: expect.any(Object),
          }),
        );
      });

      it('passing IUserGroupAccess should create a new form with FormGroup', () => {
        const formGroup = service.createUserGroupAccessFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            area: expect.any(Object),
            brand: expect.any(Object),
            audience: expect.any(Object),
            channel: expect.any(Object),
            country: expect.any(Object),
            userGroup: expect.any(Object),
          }),
        );
      });
    });

    describe('getUserGroupAccess', () => {
      it('should return NewUserGroupAccess for default UserGroupAccess initial value', () => {
        const formGroup = service.createUserGroupAccessFormGroup(sampleWithNewData);

        const userGroupAccess = service.getUserGroupAccess(formGroup) as any;

        expect(userGroupAccess).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserGroupAccess for empty UserGroupAccess initial value', () => {
        const formGroup = service.createUserGroupAccessFormGroup();

        const userGroupAccess = service.getUserGroupAccess(formGroup) as any;

        expect(userGroupAccess).toMatchObject({});
      });

      it('should return IUserGroupAccess', () => {
        const formGroup = service.createUserGroupAccessFormGroup(sampleWithRequiredData);

        const userGroupAccess = service.getUserGroupAccess(formGroup) as any;

        expect(userGroupAccess).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserGroupAccess should not enable id FormControl', () => {
        const formGroup = service.createUserGroupAccessFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserGroupAccess should disable id FormControl', () => {
        const formGroup = service.createUserGroupAccessFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
