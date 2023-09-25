import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProjectFile, NewProjectFile } from '../project-file.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProjectFile for edit and NewProjectFileFormGroupInput for create.
 */
type ProjectFileFormGroupInput = IProjectFile | PartialWithRequiredKeyOf<NewProjectFile>;

type ProjectFileFormDefaults = Pick<NewProjectFile, 'id'>;

type ProjectFileFormGroupContent = {
  id: FormControl<IProjectFile['id'] | NewProjectFile['id']>;
  file: FormControl<IProjectFile['file']>;
  fileContentType: FormControl<IProjectFile['fileContentType']>;
  name: FormControl<IProjectFile['name']>;
  project: FormControl<IProjectFile['project']>;
};

export type ProjectFileFormGroup = FormGroup<ProjectFileFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProjectFileFormService {
  createProjectFileFormGroup(projectFile: ProjectFileFormGroupInput = { id: null }): ProjectFileFormGroup {
    const projectFileRawValue = {
      ...this.getFormDefaults(),
      ...projectFile,
    };
    return new FormGroup<ProjectFileFormGroupContent>({
      id: new FormControl(
        { value: projectFileRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      file: new FormControl(projectFileRawValue.file, {
        validators: [Validators.required],
      }),
      fileContentType: new FormControl(projectFileRawValue.fileContentType),
      name: new FormControl(projectFileRawValue.name, {
        validators: [Validators.required],
      }),
      project: new FormControl(projectFileRawValue.project, {
        validators: [Validators.required],
      }),
    });
  }

  getProjectFile(form: ProjectFileFormGroup): IProjectFile | NewProjectFile {
    return form.getRawValue() as IProjectFile | NewProjectFile;
  }

  resetForm(form: ProjectFileFormGroup, projectFile: ProjectFileFormGroupInput): void {
    const projectFileRawValue = { ...this.getFormDefaults(), ...projectFile };
    form.reset(
      {
        ...projectFileRawValue,
        id: { value: projectFileRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProjectFileFormDefaults {
    return {
      id: null,
    };
  }
}
