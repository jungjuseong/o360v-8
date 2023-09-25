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
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IStakeholder } from 'app/entities/stakeholder/stakeholder.model';
import { StakeholderService } from 'app/entities/stakeholder/service/stakeholder.service';
import { StakeholderCommentService } from '../service/stakeholder-comment.service';
import { IStakeholderComment } from '../stakeholder-comment.model';
import { StakeholderCommentFormService, StakeholderCommentFormGroup } from './stakeholder-comment-form.service';

@Component({
  standalone: true,
  selector: 'jhi-stakeholder-comment-update',
  templateUrl: './stakeholder-comment-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class StakeholderCommentUpdateComponent implements OnInit {
  isSaving = false;
  stakeholderComment: IStakeholderComment | null = null;

  usersSharedCollection: IUser[] = [];
  stakeholdersSharedCollection: IStakeholder[] = [];

  editForm: StakeholderCommentFormGroup = this.stakeholderCommentFormService.createStakeholderCommentFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected stakeholderCommentService: StakeholderCommentService,
    protected stakeholderCommentFormService: StakeholderCommentFormService,
    protected userService: UserService,
    protected stakeholderService: StakeholderService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareStakeholder = (o1: IStakeholder | null, o2: IStakeholder | null): boolean => this.stakeholderService.compareStakeholder(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stakeholderComment }) => {
      this.stakeholderComment = stakeholderComment;
      if (stakeholderComment) {
        this.updateForm(stakeholderComment);
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
    const stakeholderComment = this.stakeholderCommentFormService.getStakeholderComment(this.editForm);
    if (stakeholderComment.id !== null) {
      this.subscribeToSaveResponse(this.stakeholderCommentService.update(stakeholderComment));
    } else {
      this.subscribeToSaveResponse(this.stakeholderCommentService.create(stakeholderComment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStakeholderComment>>): void {
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

  protected updateForm(stakeholderComment: IStakeholderComment): void {
    this.stakeholderComment = stakeholderComment;
    this.stakeholderCommentFormService.resetForm(this.editForm, stakeholderComment);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, stakeholderComment.user);
    this.stakeholdersSharedCollection = this.stakeholderService.addStakeholderToCollectionIfMissing<IStakeholder>(
      this.stakeholdersSharedCollection,
      stakeholderComment.stakeholder,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.stakeholderComment?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.stakeholderService
      .query()
      .pipe(map((res: HttpResponse<IStakeholder[]>) => res.body ?? []))
      .pipe(
        map((stakeholders: IStakeholder[]) =>
          this.stakeholderService.addStakeholderToCollectionIfMissing<IStakeholder>(stakeholders, this.stakeholderComment?.stakeholder),
        ),
      )
      .subscribe((stakeholders: IStakeholder[]) => (this.stakeholdersSharedCollection = stakeholders));
  }
}
