import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IJira } from '../jira.model';
import { JiraService } from '../service/jira.service';
import { JiraFormService, JiraFormGroup } from './jira-form.service';

@Component({
  standalone: true,
  selector: 'jhi-jira-update',
  templateUrl: './jira-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class JiraUpdateComponent implements OnInit {
  isSaving = false;
  jira: IJira | null = null;

  editForm: JiraFormGroup = this.jiraFormService.createJiraFormGroup();

  constructor(
    protected jiraService: JiraService,
    protected jiraFormService: JiraFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jira }) => {
      this.jira = jira;
      if (jira) {
        this.updateForm(jira);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jira = this.jiraFormService.getJira(this.editForm);
    if (jira.id !== null) {
      this.subscribeToSaveResponse(this.jiraService.update(jira));
    } else {
      this.subscribeToSaveResponse(this.jiraService.create(jira));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJira>>): void {
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

  protected updateForm(jira: IJira): void {
    this.jira = jira;
    this.jiraFormService.resetForm(this.editForm, jira);
  }
}
