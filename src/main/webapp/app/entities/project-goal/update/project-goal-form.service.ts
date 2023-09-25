import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProjectGoal, NewProjectGoal } from '../project-goal.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProjectGoal for edit and NewProjectGoalFormGroupInput for create.
 */
type ProjectGoalFormGroupInput = IProjectGoal | PartialWithRequiredKeyOf<NewProjectGoal>;

type ProjectGoalFormDefaults = Pick<NewProjectGoal, 'id'>;

type ProjectGoalFormGroupContent = {
  id: FormControl<IProjectGoal['id'] | NewProjectGoal['id']>;
  name: FormControl<IProjectGoal['name']>;
  projectCompletion: FormControl<IProjectGoal['projectCompletion']>;
  projectCompletionBurnRate: FormControl<IProjectGoal['projectCompletionBurnRate']>;
};

export type ProjectGoalFormGroup = FormGroup<ProjectGoalFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProjectGoalFormService {
  createProjectGoalFormGroup(projectGoal: ProjectGoalFormGroupInput = { id: null }): ProjectGoalFormGroup {
    const projectGoalRawValue = {
      ...this.getFormDefaults(),
      ...projectGoal,
    };
    return new FormGroup<ProjectGoalFormGroupContent>({
      id: new FormControl(
        { value: projectGoalRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(projectGoalRawValue.name, {
        validators: [Validators.required],
      }),
      projectCompletion: new FormControl(projectGoalRawValue.projectCompletion),
      projectCompletionBurnRate: new FormControl(projectGoalRawValue.projectCompletionBurnRate),
    });
  }

  getProjectGoal(form: ProjectGoalFormGroup): IProjectGoal | NewProjectGoal {
    return form.getRawValue() as IProjectGoal | NewProjectGoal;
  }

  resetForm(form: ProjectGoalFormGroup, projectGoal: ProjectGoalFormGroupInput): void {
    const projectGoalRawValue = { ...this.getFormDefaults(), ...projectGoal };
    form.reset(
      {
        ...projectGoalRawValue,
        id: { value: projectGoalRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProjectGoalFormDefaults {
    return {
      id: null,
    };
  }
}
