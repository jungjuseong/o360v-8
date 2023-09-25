import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProjectDate, NewProjectDate } from '../project-date.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProjectDate for edit and NewProjectDateFormGroupInput for create.
 */
type ProjectDateFormGroupInput = IProjectDate | PartialWithRequiredKeyOf<NewProjectDate>;

type ProjectDateFormDefaults = Pick<NewProjectDate, 'id'>;

type ProjectDateFormGroupContent = {
  id: FormControl<IProjectDate['id'] | NewProjectDate['id']>;
  date: FormControl<IProjectDate['date']>;
  projectDateType: FormControl<IProjectDate['projectDateType']>;
  project: FormControl<IProjectDate['project']>;
};

export type ProjectDateFormGroup = FormGroup<ProjectDateFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProjectDateFormService {
  createProjectDateFormGroup(projectDate: ProjectDateFormGroupInput = { id: null }): ProjectDateFormGroup {
    const projectDateRawValue = {
      ...this.getFormDefaults(),
      ...projectDate,
    };
    return new FormGroup<ProjectDateFormGroupContent>({
      id: new FormControl(
        { value: projectDateRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      date: new FormControl(projectDateRawValue.date, {
        validators: [Validators.required],
      }),
      projectDateType: new FormControl(projectDateRawValue.projectDateType),
      project: new FormControl(projectDateRawValue.project, {
        validators: [Validators.required],
      }),
    });
  }

  getProjectDate(form: ProjectDateFormGroup): IProjectDate | NewProjectDate {
    return form.getRawValue() as IProjectDate | NewProjectDate;
  }

  resetForm(form: ProjectDateFormGroup, projectDate: ProjectDateFormGroupInput): void {
    const projectDateRawValue = { ...this.getFormDefaults(), ...projectDate };
    form.reset(
      {
        ...projectDateRawValue,
        id: { value: projectDateRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProjectDateFormDefaults {
    return {
      id: null,
    };
  }
}
