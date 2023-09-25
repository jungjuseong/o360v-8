import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IJiraSetUp, NewJiraSetUp } from '../jira-set-up.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJiraSetUp for edit and NewJiraSetUpFormGroupInput for create.
 */
type JiraSetUpFormGroupInput = IJiraSetUp | PartialWithRequiredKeyOf<NewJiraSetUp>;

type JiraSetUpFormDefaults = Pick<NewJiraSetUp, 'id'>;

type JiraSetUpFormGroupContent = {
  id: FormControl<IJiraSetUp['id'] | NewJiraSetUp['id']>;
  url: FormControl<IJiraSetUp['url']>;
  apiKey: FormControl<IJiraSetUp['apiKey']>;
  project: FormControl<IJiraSetUp['project']>;
};

export type JiraSetUpFormGroup = FormGroup<JiraSetUpFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JiraSetUpFormService {
  createJiraSetUpFormGroup(jiraSetUp: JiraSetUpFormGroupInput = { id: null }): JiraSetUpFormGroup {
    const jiraSetUpRawValue = {
      ...this.getFormDefaults(),
      ...jiraSetUp,
    };
    return new FormGroup<JiraSetUpFormGroupContent>({
      id: new FormControl(
        { value: jiraSetUpRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      url: new FormControl(jiraSetUpRawValue.url, {
        validators: [Validators.required],
      }),
      apiKey: new FormControl(jiraSetUpRawValue.apiKey, {
        validators: [Validators.required],
      }),
      project: new FormControl(jiraSetUpRawValue.project, {
        validators: [Validators.required],
      }),
    });
  }

  getJiraSetUp(form: JiraSetUpFormGroup): IJiraSetUp | NewJiraSetUp {
    return form.getRawValue() as IJiraSetUp | NewJiraSetUp;
  }

  resetForm(form: JiraSetUpFormGroup, jiraSetUp: JiraSetUpFormGroupInput): void {
    const jiraSetUpRawValue = { ...this.getFormDefaults(), ...jiraSetUp };
    form.reset(
      {
        ...jiraSetUpRawValue,
        id: { value: jiraSetUpRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): JiraSetUpFormDefaults {
    return {
      id: null,
    };
  }
}
