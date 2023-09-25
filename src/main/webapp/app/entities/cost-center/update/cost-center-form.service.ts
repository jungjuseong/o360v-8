import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICostCenter, NewCostCenter } from '../cost-center.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICostCenter for edit and NewCostCenterFormGroupInput for create.
 */
type CostCenterFormGroupInput = ICostCenter | PartialWithRequiredKeyOf<NewCostCenter>;

type CostCenterFormDefaults = Pick<NewCostCenter, 'id'>;

type CostCenterFormGroupContent = {
  id: FormControl<ICostCenter['id'] | NewCostCenter['id']>;
  costCenter: FormControl<ICostCenter['costCenter']>;
};

export type CostCenterFormGroup = FormGroup<CostCenterFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CostCenterFormService {
  createCostCenterFormGroup(costCenter: CostCenterFormGroupInput = { id: null }): CostCenterFormGroup {
    const costCenterRawValue = {
      ...this.getFormDefaults(),
      ...costCenter,
    };
    return new FormGroup<CostCenterFormGroupContent>({
      id: new FormControl(
        { value: costCenterRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      costCenter: new FormControl(costCenterRawValue.costCenter, {
        validators: [Validators.required],
      }),
    });
  }

  getCostCenter(form: CostCenterFormGroup): ICostCenter | NewCostCenter {
    return form.getRawValue() as ICostCenter | NewCostCenter;
  }

  resetForm(form: CostCenterFormGroup, costCenter: CostCenterFormGroupInput): void {
    const costCenterRawValue = { ...this.getFormDefaults(), ...costCenter };
    form.reset(
      {
        ...costCenterRawValue,
        id: { value: costCenterRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CostCenterFormDefaults {
    return {
      id: null,
    };
  }
}
