import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProjectOwner, NewProjectOwner } from '../project-owner.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProjectOwner for edit and NewProjectOwnerFormGroupInput for create.
 */
type ProjectOwnerFormGroupInput = IProjectOwner | PartialWithRequiredKeyOf<NewProjectOwner>;

type ProjectOwnerFormDefaults = Pick<NewProjectOwner, 'id'>;

type ProjectOwnerFormGroupContent = {
  id: FormControl<IProjectOwner['id'] | NewProjectOwner['id']>;
  name: FormControl<IProjectOwner['name']>;
};

export type ProjectOwnerFormGroup = FormGroup<ProjectOwnerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProjectOwnerFormService {
  createProjectOwnerFormGroup(projectOwner: ProjectOwnerFormGroupInput = { id: null }): ProjectOwnerFormGroup {
    const projectOwnerRawValue = {
      ...this.getFormDefaults(),
      ...projectOwner,
    };
    return new FormGroup<ProjectOwnerFormGroupContent>({
      id: new FormControl(
        { value: projectOwnerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(projectOwnerRawValue.name, {
        validators: [Validators.required],
      }),
    });
  }

  getProjectOwner(form: ProjectOwnerFormGroup): IProjectOwner | NewProjectOwner {
    return form.getRawValue() as IProjectOwner | NewProjectOwner;
  }

  resetForm(form: ProjectOwnerFormGroup, projectOwner: ProjectOwnerFormGroupInput): void {
    const projectOwnerRawValue = { ...this.getFormDefaults(), ...projectOwner };
    form.reset(
      {
        ...projectOwnerRawValue,
        id: { value: projectOwnerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProjectOwnerFormDefaults {
    return {
      id: null,
    };
  }
}
