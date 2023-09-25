import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IJira, NewJira } from '../jira.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJira for edit and NewJiraFormGroupInput for create.
 */
type JiraFormGroupInput = IJira | PartialWithRequiredKeyOf<NewJira>;

type JiraFormDefaults = Pick<NewJira, 'id'>;

type JiraFormGroupContent = {
  id: FormControl<IJira['id'] | NewJira['id']>;
  url: FormControl<IJira['url']>;
  apiKey: FormControl<IJira['apiKey']>;
  project: FormControl<IJira['project']>;
};

export type JiraFormGroup = FormGroup<JiraFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JiraFormService {
  createJiraFormGroup(jira: JiraFormGroupInput = { id: null }): JiraFormGroup {
    const jiraRawValue = {
      ...this.getFormDefaults(),
      ...jira,
    };
    return new FormGroup<JiraFormGroupContent>({
      id: new FormControl(
        { value: jiraRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      url: new FormControl(jiraRawValue.url, {
        validators: [Validators.required],
      }),
      apiKey: new FormControl(jiraRawValue.apiKey, {
        validators: [Validators.required],
      }),
      project: new FormControl(jiraRawValue.project, {
        validators: [Validators.required],
      }),
    });
  }

  getJira(form: JiraFormGroup): IJira | NewJira {
    return form.getRawValue() as IJira | NewJira;
  }

  resetForm(form: JiraFormGroup, jira: JiraFormGroupInput): void {
    const jiraRawValue = { ...this.getFormDefaults(), ...jira };
    form.reset(
      {
        ...jiraRawValue,
        id: { value: jiraRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): JiraFormDefaults {
    return {
      id: null,
    };
  }
}
