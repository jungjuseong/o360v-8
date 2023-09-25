import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProjectGoal } from '../project-goal.model';
import { ProjectGoalService } from '../service/project-goal.service';
import { ProjectGoalFormService, ProjectGoalFormGroup } from './project-goal-form.service';

@Component({
  standalone: true,
  selector: 'jhi-project-goal-update',
  templateUrl: './project-goal-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProjectGoalUpdateComponent implements OnInit {
  isSaving = false;
  projectGoal: IProjectGoal | null = null;

  editForm: ProjectGoalFormGroup = this.projectGoalFormService.createProjectGoalFormGroup();

  constructor(
    protected projectGoalService: ProjectGoalService,
    protected projectGoalFormService: ProjectGoalFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ projectGoal }) => {
      this.projectGoal = projectGoal;
      if (projectGoal) {
        this.updateForm(projectGoal);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const projectGoal = this.projectGoalFormService.getProjectGoal(this.editForm);
    if (projectGoal.id !== null) {
      this.subscribeToSaveResponse(this.projectGoalService.update(projectGoal));
    } else {
      this.subscribeToSaveResponse(this.projectGoalService.create(projectGoal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProjectGoal>>): void {
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

  protected updateForm(projectGoal: IProjectGoal): void {
    this.projectGoal = projectGoal;
    this.projectGoalFormService.resetForm(this.editForm, projectGoal);
  }
}
