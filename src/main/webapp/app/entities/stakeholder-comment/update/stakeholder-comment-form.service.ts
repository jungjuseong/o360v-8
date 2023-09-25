import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IStakeholderComment, NewStakeholderComment } from '../stakeholder-comment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStakeholderComment for edit and NewStakeholderCommentFormGroupInput for create.
 */
type StakeholderCommentFormGroupInput = IStakeholderComment | PartialWithRequiredKeyOf<NewStakeholderComment>;

type StakeholderCommentFormDefaults = Pick<NewStakeholderComment, 'id'>;

type StakeholderCommentFormGroupContent = {
  id: FormControl<IStakeholderComment['id'] | NewStakeholderComment['id']>;
  createdDate: FormControl<IStakeholderComment['createdDate']>;
  comment: FormControl<IStakeholderComment['comment']>;
  user: FormControl<IStakeholderComment['user']>;
  stakeholder: FormControl<IStakeholderComment['stakeholder']>;
};

export type StakeholderCommentFormGroup = FormGroup<StakeholderCommentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StakeholderCommentFormService {
  createStakeholderCommentFormGroup(stakeholderComment: StakeholderCommentFormGroupInput = { id: null }): StakeholderCommentFormGroup {
    const stakeholderCommentRawValue = {
      ...this.getFormDefaults(),
      ...stakeholderComment,
    };
    return new FormGroup<StakeholderCommentFormGroupContent>({
      id: new FormControl(
        { value: stakeholderCommentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      createdDate: new FormControl(stakeholderCommentRawValue.createdDate, {
        validators: [Validators.required],
      }),
      comment: new FormControl(stakeholderCommentRawValue.comment, {
        validators: [Validators.required],
      }),
      user: new FormControl(stakeholderCommentRawValue.user, {
        validators: [Validators.required],
      }),
      stakeholder: new FormControl(stakeholderCommentRawValue.stakeholder, {
        validators: [Validators.required],
      }),
    });
  }

  getStakeholderComment(form: StakeholderCommentFormGroup): IStakeholderComment | NewStakeholderComment {
    return form.getRawValue() as IStakeholderComment | NewStakeholderComment;
  }

  resetForm(form: StakeholderCommentFormGroup, stakeholderComment: StakeholderCommentFormGroupInput): void {
    const stakeholderCommentRawValue = { ...this.getFormDefaults(), ...stakeholderComment };
    form.reset(
      {
        ...stakeholderCommentRawValue,
        id: { value: stakeholderCommentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): StakeholderCommentFormDefaults {
    return {
      id: null,
    };
  }
}
