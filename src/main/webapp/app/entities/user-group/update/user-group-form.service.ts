import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserGroup, NewUserGroup } from '../user-group.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserGroup for edit and NewUserGroupFormGroupInput for create.
 */
type UserGroupFormGroupInput = IUserGroup | PartialWithRequiredKeyOf<NewUserGroup>;

type UserGroupFormDefaults = Pick<NewUserGroup, 'id' | 'users'>;

type UserGroupFormGroupContent = {
  id: FormControl<IUserGroup['id'] | NewUserGroup['id']>;
  name: FormControl<IUserGroup['name']>;
  users: FormControl<IUserGroup['users']>;
};

export type UserGroupFormGroup = FormGroup<UserGroupFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserGroupFormService {
  createUserGroupFormGroup(userGroup: UserGroupFormGroupInput = { id: null }): UserGroupFormGroup {
    const userGroupRawValue = {
      ...this.getFormDefaults(),
      ...userGroup,
    };
    return new FormGroup<UserGroupFormGroupContent>({
      id: new FormControl(
        { value: userGroupRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(userGroupRawValue.name, {
        validators: [Validators.required],
      }),
      users: new FormControl(userGroupRawValue.users ?? []),
    });
  }

  getUserGroup(form: UserGroupFormGroup): IUserGroup | NewUserGroup {
    return form.getRawValue() as IUserGroup | NewUserGroup;
  }

  resetForm(form: UserGroupFormGroup, userGroup: UserGroupFormGroupInput): void {
    const userGroupRawValue = { ...this.getFormDefaults(), ...userGroup };
    form.reset(
      {
        ...userGroupRawValue,
        id: { value: userGroupRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): UserGroupFormDefaults {
    return {
      id: null,
      users: [],
    };
  }
}
