import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserGroupAccess, NewUserGroupAccess } from '../user-group-access.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserGroupAccess for edit and NewUserGroupAccessFormGroupInput for create.
 */
type UserGroupAccessFormGroupInput = IUserGroupAccess | PartialWithRequiredKeyOf<NewUserGroupAccess>;

type UserGroupAccessFormDefaults = Pick<NewUserGroupAccess, 'id'>;

type UserGroupAccessFormGroupContent = {
  id: FormControl<IUserGroupAccess['id'] | NewUserGroupAccess['id']>;
  area: FormControl<IUserGroupAccess['area']>;
  brand: FormControl<IUserGroupAccess['brand']>;
  audience: FormControl<IUserGroupAccess['audience']>;
  channel: FormControl<IUserGroupAccess['channel']>;
  country: FormControl<IUserGroupAccess['country']>;
  userGroup: FormControl<IUserGroupAccess['userGroup']>;
};

export type UserGroupAccessFormGroup = FormGroup<UserGroupAccessFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserGroupAccessFormService {
  createUserGroupAccessFormGroup(userGroupAccess: UserGroupAccessFormGroupInput = { id: null }): UserGroupAccessFormGroup {
    const userGroupAccessRawValue = {
      ...this.getFormDefaults(),
      ...userGroupAccess,
    };
    return new FormGroup<UserGroupAccessFormGroupContent>({
      id: new FormControl(
        { value: userGroupAccessRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      area: new FormControl(userGroupAccessRawValue.area, {
        validators: [Validators.required],
      }),
      brand: new FormControl(userGroupAccessRawValue.brand, {
        validators: [Validators.required],
      }),
      audience: new FormControl(userGroupAccessRawValue.audience, {
        validators: [Validators.required],
      }),
      channel: new FormControl(userGroupAccessRawValue.channel, {
        validators: [Validators.required],
      }),
      country: new FormControl(userGroupAccessRawValue.country, {
        validators: [Validators.required],
      }),
      userGroup: new FormControl(userGroupAccessRawValue.userGroup, {
        validators: [Validators.required],
      }),
    });
  }

  getUserGroupAccess(form: UserGroupAccessFormGroup): IUserGroupAccess | NewUserGroupAccess {
    return form.getRawValue() as IUserGroupAccess | NewUserGroupAccess;
  }

  resetForm(form: UserGroupAccessFormGroup, userGroupAccess: UserGroupAccessFormGroupInput): void {
    const userGroupAccessRawValue = { ...this.getFormDefaults(), ...userGroupAccess };
    form.reset(
      {
        ...userGroupAccessRawValue,
        id: { value: userGroupAccessRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): UserGroupAccessFormDefaults {
    return {
      id: null,
    };
  }
}
