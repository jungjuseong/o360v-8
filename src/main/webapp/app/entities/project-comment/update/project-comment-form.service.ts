import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProjectComment, NewProjectComment } from '../project-comment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProjectComment for edit and NewProjectCommentFormGroupInput for create.
 */
type ProjectCommentFormGroupInput = IProjectComment | PartialWithRequiredKeyOf<NewProjectComment>;

type ProjectCommentFormDefaults = Pick<NewProjectComment, 'id'>;

type ProjectCommentFormGroupContent = {
  id: FormControl<IProjectComment['id'] | NewProjectComment['id']>;
  createdDate: FormControl<IProjectComment['createdDate']>;
  comment: FormControl<IProjectComment['comment']>;
  user: FormControl<IProjectComment['user']>;
  project: FormControl<IProjectComment['project']>;
};

export type ProjectCommentFormGroup = FormGroup<ProjectCommentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProjectCommentFormService {
  createProjectCommentFormGroup(projectComment: ProjectCommentFormGroupInput = { id: null }): ProjectCommentFormGroup {
    const projectCommentRawValue = {
      ...this.getFormDefaults(),
      ...projectComment,
    };
    return new FormGroup<ProjectCommentFormGroupContent>({
      id: new FormControl(
        { value: projectCommentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      createdDate: new FormControl(projectCommentRawValue.createdDate, {
        validators: [Validators.required],
      }),
      comment: new FormControl(projectCommentRawValue.comment, {
        validators: [Validators.required],
      }),
      user: new FormControl(projectCommentRawValue.user, {
        validators: [Validators.required],
      }),
      project: new FormControl(projectCommentRawValue.project, {
        validators: [Validators.required],
      }),
    });
  }

  getProjectComment(form: ProjectCommentFormGroup): IProjectComment | NewProjectComment {
    return form.getRawValue() as IProjectComment | NewProjectComment;
  }

  resetForm(form: ProjectCommentFormGroup, projectComment: ProjectCommentFormGroupInput): void {
    const projectCommentRawValue = { ...this.getFormDefaults(), ...projectComment };
    form.reset(
      {
        ...projectCommentRawValue,
        id: { value: projectCommentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProjectCommentFormDefaults {
    return {
      id: null,
    };
  }
}
