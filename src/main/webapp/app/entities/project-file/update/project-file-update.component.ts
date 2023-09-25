import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';
import { ProjectFileService } from '../service/project-file.service';
import { IProjectFile } from '../project-file.model';
import { ProjectFileFormService, ProjectFileFormGroup } from './project-file-form.service';

@Component({
  standalone: true,
  selector: 'jhi-project-file-update',
  templateUrl: './project-file-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProjectFileUpdateComponent implements OnInit {
  isSaving = false;
  projectFile: IProjectFile | null = null;

  projectsSharedCollection: IProject[] = [];

  editForm: ProjectFileFormGroup = this.projectFileFormService.createProjectFileFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected projectFileService: ProjectFileService,
    protected projectFileFormService: ProjectFileFormService,
    protected projectService: ProjectService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareProject = (o1: IProject | null, o2: IProject | null): boolean => this.projectService.compareProject(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ projectFile }) => {
      this.projectFile = projectFile;
      if (projectFile) {
        this.updateForm(projectFile);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('o360VApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const projectFile = this.projectFileFormService.getProjectFile(this.editForm);
    if (projectFile.id !== null) {
      this.subscribeToSaveResponse(this.projectFileService.update(projectFile));
    } else {
      this.subscribeToSaveResponse(this.projectFileService.create(projectFile));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProjectFile>>): void {
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

  protected updateForm(projectFile: IProjectFile): void {
    this.projectFile = projectFile;
    this.projectFileFormService.resetForm(this.editForm, projectFile);

    this.projectsSharedCollection = this.projectService.addProjectToCollectionIfMissing<IProject>(
      this.projectsSharedCollection,
      projectFile.project,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.projectService
      .query()
      .pipe(map((res: HttpResponse<IProject[]>) => res.body ?? []))
      .pipe(
        map((projects: IProject[]) => this.projectService.addProjectToCollectionIfMissing<IProject>(projects, this.projectFile?.project)),
      )
      .subscribe((projects: IProject[]) => (this.projectsSharedCollection = projects));
  }
}
