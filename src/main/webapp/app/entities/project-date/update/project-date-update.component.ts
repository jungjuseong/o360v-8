import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';
import { ProjectDateType } from 'app/entities/enumerations/project-date-type.model';
import { ProjectDateService } from '../service/project-date.service';
import { IProjectDate } from '../project-date.model';
import { ProjectDateFormService, ProjectDateFormGroup } from './project-date-form.service';

@Component({
  standalone: true,
  selector: 'jhi-project-date-update',
  templateUrl: './project-date-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProjectDateUpdateComponent implements OnInit {
  isSaving = false;
  projectDate: IProjectDate | null = null;
  projectDateTypeValues = Object.keys(ProjectDateType);

  projectsSharedCollection: IProject[] = [];

  editForm: ProjectDateFormGroup = this.projectDateFormService.createProjectDateFormGroup();

  constructor(
    protected projectDateService: ProjectDateService,
    protected projectDateFormService: ProjectDateFormService,
    protected projectService: ProjectService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareProject = (o1: IProject | null, o2: IProject | null): boolean => this.projectService.compareProject(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ projectDate }) => {
      this.projectDate = projectDate;
      if (projectDate) {
        this.updateForm(projectDate);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const projectDate = this.projectDateFormService.getProjectDate(this.editForm);
    if (projectDate.id !== null) {
      this.subscribeToSaveResponse(this.projectDateService.update(projectDate));
    } else {
      this.subscribeToSaveResponse(this.projectDateService.create(projectDate));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProjectDate>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(projectDate: IProjectDate): void {
    this.projectDate = projectDate;
    this.projectDateFormService.resetForm(this.editForm, projectDate);

    this.projectsSharedCollection = this.projectService.addProjectToCollectionIfMissing<IProject>(
      this.projectsSharedCollection,
      projectDate.project,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.projectService
      .query()
      .pipe(map((res: HttpResponse<IProject[]>) => res.body ?? []))
      .pipe(
        map((projects: IProject[]) => this.projectService.addProjectToCollectionIfMissing<IProject>(projects, this.projectDate?.project)),
      )
      .subscribe((projects: IProject[]) => (this.projectsSharedCollection = projects));
  }
}
