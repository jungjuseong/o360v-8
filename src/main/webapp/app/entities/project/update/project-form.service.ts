import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProject, NewProject } from '../project.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProject for edit and NewProjectFormGroupInput for create.
 */
type ProjectFormGroupInput = IProject | PartialWithRequiredKeyOf<NewProject>;

type ProjectFormDefaults = Pick<NewProject, 'id' | 'countries'>;

type ProjectFormGroupContent = {
  id: FormControl<IProject['id'] | NewProject['id']>;
  code: FormControl<IProject['code']>;
  title: FormControl<IProject['title']>;
  fiscalYear: FormControl<IProject['fiscalYear']>;
  budget: FormControl<IProject['budget']>;
  createdDate: FormControl<IProject['createdDate']>;
  startDate: FormControl<IProject['startDate']>;
  deploymentDate: FormControl<IProject['deploymentDate']>;
  endDate: FormControl<IProject['endDate']>;
  description: FormControl<IProject['description']>;
  poNumber: FormControl<IProject['poNumber']>;
  jiraCode: FormControl<IProject['jiraCode']>;
  jiraUpdate: FormControl<IProject['jiraUpdate']>;
  projectStatus: FormControl<IProject['projectStatus']>;
  projectFinancialStatus: FormControl<IProject['projectFinancialStatus']>;
  countries: FormControl<IProject['countries']>;
  parentProject: FormControl<IProject['parentProject']>;
  goal: FormControl<IProject['goal']>;
  channel: FormControl<IProject['channel']>;
  costCenter: FormControl<IProject['costCenter']>;
  accountNumber: FormControl<IProject['accountNumber']>;
  projectOwner: FormControl<IProject['projectOwner']>;
};

export type ProjectFormGroup = FormGroup<ProjectFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProjectFormService {
  createProjectFormGroup(project: ProjectFormGroupInput = { id: null }): ProjectFormGroup {
    const projectRawValue = {
      ...this.getFormDefaults(),
      ...project,
    };
    return new FormGroup<ProjectFormGroupContent>({
      id: new FormControl(
        { value: projectRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      code: new FormControl(projectRawValue.code, {
        validators: [Validators.required],
      }),
      title: new FormControl(projectRawValue.title, {
        validators: [Validators.required],
      }),
      fiscalYear: new FormControl(projectRawValue.fiscalYear, {
        validators: [Validators.required],
      }),
      budget: new FormControl(projectRawValue.budget, {
        validators: [Validators.required],
      }),
      createdDate: new FormControl(projectRawValue.createdDate, {
        validators: [Validators.required],
      }),
      startDate: new FormControl(projectRawValue.startDate, {
        validators: [Validators.required],
      }),
      deploymentDate: new FormControl(projectRawValue.deploymentDate, {
        validators: [Validators.required],
      }),
      endDate: new FormControl(projectRawValue.endDate, {
        validators: [Validators.required],
      }),
      description: new FormControl(projectRawValue.description),
      poNumber: new FormControl(projectRawValue.poNumber, {
        validators: [Validators.required],
      }),
      jiraCode: new FormControl(projectRawValue.jiraCode),
      jiraUpdate: new FormControl(projectRawValue.jiraUpdate),
      projectStatus: new FormControl(projectRawValue.projectStatus),
      projectFinancialStatus: new FormControl(projectRawValue.projectFinancialStatus),
      countries: new FormControl(projectRawValue.countries ?? []),
      parentProject: new FormControl(projectRawValue.parentProject),
      goal: new FormControl(projectRawValue.goal),
      channel: new FormControl(projectRawValue.channel, {
        validators: [Validators.required],
      }),
      costCenter: new FormControl(projectRawValue.costCenter),
      accountNumber: new FormControl(projectRawValue.accountNumber),
      projectOwner: new FormControl(projectRawValue.projectOwner),
    });
  }

  getProject(form: ProjectFormGroup): IProject | NewProject {
    return form.getRawValue() as IProject | NewProject;
  }

  resetForm(form: ProjectFormGroup, project: ProjectFormGroupInput): void {
    const projectRawValue = { ...this.getFormDefaults(), ...project };
    form.reset(
      {
        ...projectRawValue,
        id: { value: projectRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ProjectFormDefaults {
    return {
      id: null,
      countries: [],
    };
  }
}
