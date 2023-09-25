import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAudience, NewAudience } from '../audience.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAudience for edit and NewAudienceFormGroupInput for create.
 */
type AudienceFormGroupInput = IAudience | PartialWithRequiredKeyOf<NewAudience>;

type AudienceFormDefaults = Pick<NewAudience, 'id'>;

type AudienceFormGroupContent = {
  id: FormControl<IAudience['id'] | NewAudience['id']>;
  brand: FormControl<IAudience['brand']>;
};

export type AudienceFormGroup = FormGroup<AudienceFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AudienceFormService {
  createAudienceFormGroup(audience: AudienceFormGroupInput = { id: null }): AudienceFormGroup {
    const audienceRawValue = {
      ...this.getFormDefaults(),
      ...audience,
    };
    return new FormGroup<AudienceFormGroupContent>({
      id: new FormControl(
        { value: audienceRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      brand: new FormControl(audienceRawValue.brand, {
        validators: [Validators.required],
      }),
    });
  }

  getAudience(form: AudienceFormGroup): IAudience | NewAudience {
    return form.getRawValue() as IAudience | NewAudience;
  }

  resetForm(form: AudienceFormGroup, audience: AudienceFormGroupInput): void {
    const audienceRawValue = { ...this.getFormDefaults(), ...audience };
    form.reset(
      {
        ...audienceRawValue,
        id: { value: audienceRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AudienceFormDefaults {
    return {
      id: null,
    };
  }
}
