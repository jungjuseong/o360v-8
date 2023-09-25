import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IStakeholder, NewStakeholder } from '../stakeholder.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStakeholder for edit and NewStakeholderFormGroupInput for create.
 */
type StakeholderFormGroupInput = IStakeholder | PartialWithRequiredKeyOf<NewStakeholder>;

type StakeholderFormDefaults = Pick<NewStakeholder, 'id' | 'users'>;

type StakeholderFormGroupContent = {
  id: FormControl<IStakeholder['id'] | NewStakeholder['id']>;
  createdDate: FormControl<IStakeholder['createdDate']>;
  cost: FormControl<IStakeholder['cost']>;
  stakeholderType: FormControl<IStakeholder['stakeholderType']>;
  users: FormControl<IStakeholder['users']>;
  project: FormControl<IStakeholder['project']>;
};

export type StakeholderFormGroup = FormGroup<StakeholderFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StakeholderFormService {
  createStakeholderFormGroup(stakeholder: StakeholderFormGroupInput = { id: null }): StakeholderFormGroup {
    const stakeholderRawValue = {
      ...this.getFormDefaults(),
      ...stakeholder,
    };
    return new FormGroup<StakeholderFormGroupContent>({
      id: new FormControl(
        { value: stakeholderRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      createdDate: new FormControl(stakeholderRawValue.createdDate, {
        validators: [Validators.required],
      }),
      cost: new FormControl(stakeholderRawValue.cost),
      stakeholderType: new FormControl(stakeholderRawValue.stakeholderType),
      users: new FormControl(stakeholderRawValue.users ?? []),
      project: new FormControl(stakeholderRawValue.project, {
        validators: [Validators.required],
      }),
    });
  }

  getStakeholder(form: StakeholderFormGroup): IStakeholder | NewStakeholder {
    return form.getRawValue() as IStakeholder | NewStakeholder;
  }

  resetForm(form: StakeholderFormGroup, stakeholder: StakeholderFormGroupInput): void {
    const stakeholderRawValue = { ...this.getFormDefaults(), ...stakeholder };
    form.reset(
      {
        ...stakeholderRawValue,
        id: { value: stakeholderRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): StakeholderFormDefaults {
    return {
      id: null,
      users: [],
    };
  }
}
