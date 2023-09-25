import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAccountNumber, NewAccountNumber } from '../account-number.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAccountNumber for edit and NewAccountNumberFormGroupInput for create.
 */
type AccountNumberFormGroupInput = IAccountNumber | PartialWithRequiredKeyOf<NewAccountNumber>;

type AccountNumberFormDefaults = Pick<NewAccountNumber, 'id'>;

type AccountNumberFormGroupContent = {
  id: FormControl<IAccountNumber['id'] | NewAccountNumber['id']>;
  accountNumber: FormControl<IAccountNumber['accountNumber']>;
};

export type AccountNumberFormGroup = FormGroup<AccountNumberFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AccountNumberFormService {
  createAccountNumberFormGroup(accountNumber: AccountNumberFormGroupInput = { id: null }): AccountNumberFormGroup {
    const accountNumberRawValue = {
      ...this.getFormDefaults(),
      ...accountNumber,
    };
    return new FormGroup<AccountNumberFormGroupContent>({
      id: new FormControl(
        { value: accountNumberRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      accountNumber: new FormControl(accountNumberRawValue.accountNumber, {
        validators: [Validators.required],
      }),
    });
  }

  getAccountNumber(form: AccountNumberFormGroup): IAccountNumber | NewAccountNumber {
    return form.getRawValue() as IAccountNumber | NewAccountNumber;
  }

  resetForm(form: AccountNumberFormGroup, accountNumber: AccountNumberFormGroupInput): void {
    const accountNumberRawValue = { ...this.getFormDefaults(), ...accountNumber };
    form.reset(
      {
        ...accountNumberRawValue,
        id: { value: accountNumberRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AccountNumberFormDefaults {
    return {
      id: null,
    };
  }
}
