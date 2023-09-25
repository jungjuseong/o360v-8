import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IJiraSetUp } from '../jira-set-up.model';
import { JiraSetUpService } from '../service/jira-set-up.service';
import { JiraSetUpFormService, JiraSetUpFormGroup } from './jira-set-up-form.service';

@Component({
  standalone: true,
  selector: 'jhi-jira-set-up-update',
  templateUrl: './jira-set-up-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class JiraSetUpUpdateComponent implements OnInit {
  isSaving = false;
  jiraSetUp: IJiraSetUp | null = null;

  editForm: JiraSetUpFormGroup = this.jiraSetUpFormService.createJiraSetUpFormGroup();

  constructor(
    protected jiraSetUpService: JiraSetUpService,
    protected jiraSetUpFormService: JiraSetUpFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jiraSetUp }) => {
      this.jiraSetUp = jiraSetUp;
      if (jiraSetUp) {
        this.updateForm(jiraSetUp);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jiraSetUp = this.jiraSetUpFormService.getJiraSetUp(this.editForm);
    if (jiraSetUp.id !== null) {
      this.subscribeToSaveResponse(this.jiraSetUpService.update(jiraSetUp));
    } else {
      this.subscribeToSaveResponse(this.jiraSetUpService.create(jiraSetUp));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJiraSetUp>>): void {
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

  protected updateForm(jiraSetUp: IJiraSetUp): void {
    this.jiraSetUp = jiraSetUp;
    this.jiraSetUpFormService.resetForm(this.editForm, jiraSetUp);
  }
}
