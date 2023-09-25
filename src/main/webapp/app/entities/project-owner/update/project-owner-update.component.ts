import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProjectOwner } from '../project-owner.model';
import { ProjectOwnerService } from '../service/project-owner.service';
import { ProjectOwnerFormService, ProjectOwnerFormGroup } from './project-owner-form.service';

@Component({
  standalone: true,
  selector: 'jhi-project-owner-update',
  templateUrl: './project-owner-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProjectOwnerUpdateComponent implements OnInit {
  isSaving = false;
  projectOwner: IProjectOwner | null = null;

  editForm: ProjectOwnerFormGroup = this.projectOwnerFormService.createProjectOwnerFormGroup();

  constructor(
    protected projectOwnerService: ProjectOwnerService,
    protected projectOwnerFormService: ProjectOwnerFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ projectOwner }) => {
      this.projectOwner = projectOwner;
      if (projectOwner) {
        this.updateForm(projectOwner);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const projectOwner = this.projectOwnerFormService.getProjectOwner(this.editForm);
    if (projectOwner.id !== null) {
      this.subscribeToSaveResponse(this.projectOwnerService.update(projectOwner));
    } else {
      this.subscribeToSaveResponse(this.projectOwnerService.create(projectOwner));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProjectOwner>>): void {
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

  protected updateForm(projectOwner: IProjectOwner): void {
    this.projectOwner = projectOwner;
    this.projectOwnerFormService.resetForm(this.editForm, projectOwner);
  }
}
