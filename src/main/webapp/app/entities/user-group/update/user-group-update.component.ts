import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IUserGroup } from '../user-group.model';
import { UserGroupService } from '../service/user-group.service';
import { UserGroupFormService, UserGroupFormGroup } from './user-group-form.service';

@Component({
  standalone: true,
  selector: 'jhi-user-group-update',
  templateUrl: './user-group-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UserGroupUpdateComponent implements OnInit {
  isSaving = false;
  userGroup: IUserGroup | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: UserGroupFormGroup = this.userGroupFormService.createUserGroupFormGroup();

  constructor(
    protected userGroupService: UserGroupService,
    protected userGroupFormService: UserGroupFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userGroup }) => {
      this.userGroup = userGroup;
      if (userGroup) {
        this.updateForm(userGroup);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userGroup = this.userGroupFormService.getUserGroup(this.editForm);
    if (userGroup.id !== null) {
      this.subscribeToSaveResponse(this.userGroupService.update(userGroup));
    } else {
      this.subscribeToSaveResponse(this.userGroupService.create(userGroup));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserGroup>>): void {
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

  protected updateForm(userGroup: IUserGroup): void {
    this.userGroup = userGroup;
    this.userGroupFormService.resetForm(this.editForm, userGroup);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(
      this.usersSharedCollection,
      ...(userGroup.users ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, ...(this.userGroup?.users ?? []))))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
