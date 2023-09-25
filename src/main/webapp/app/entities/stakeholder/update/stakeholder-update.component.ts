import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';
import { StakeholderType } from 'app/entities/enumerations/stakeholder-type.model';
import { StakeholderService } from '../service/stakeholder.service';
import { IStakeholder } from '../stakeholder.model';
import { StakeholderFormService, StakeholderFormGroup } from './stakeholder-form.service';

@Component({
  standalone: true,
  selector: 'jhi-stakeholder-update',
  templateUrl: './stakeholder-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class StakeholderUpdateComponent implements OnInit {
  isSaving = false;
  stakeholder: IStakeholder | null = null;
  stakeholderTypeValues = Object.keys(StakeholderType);

  usersSharedCollection: IUser[] = [];
  projectsSharedCollection: IProject[] = [];

  editForm: StakeholderFormGroup = this.stakeholderFormService.createStakeholderFormGroup();

  constructor(
    protected stakeholderService: StakeholderService,
    protected stakeholderFormService: StakeholderFormService,
    protected userService: UserService,
    protected projectService: ProjectService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareProject = (o1: IProject | null, o2: IProject | null): boolean => this.projectService.compareProject(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stakeholder }) => {
      this.stakeholder = stakeholder;
      if (stakeholder) {
        this.updateForm(stakeholder);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const stakeholder = this.stakeholderFormService.getStakeholder(this.editForm);
    if (stakeholder.id !== null) {
      this.subscribeToSaveResponse(this.stakeholderService.update(stakeholder));
    } else {
      this.subscribeToSaveResponse(this.stakeholderService.create(stakeholder));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStakeholder>>): void {
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

  protected updateForm(stakeholder: IStakeholder): void {
    this.stakeholder = stakeholder;
    this.stakeholderFormService.resetForm(this.editForm, stakeholder);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(
      this.usersSharedCollection,
      ...(stakeholder.users ?? []),
    );
    this.projectsSharedCollection = this.projectService.addProjectToCollectionIfMissing<IProject>(
      this.projectsSharedCollection,
      stakeholder.project,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, ...(this.stakeholder?.users ?? []))))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.projectService
      .query()
      .pipe(map((res: HttpResponse<IProject[]>) => res.body ?? []))
      .pipe(
        map((projects: IProject[]) => this.projectService.addProjectToCollectionIfMissing<IProject>(projects, this.stakeholder?.project)),
      )
      .subscribe((projects: IProject[]) => (this.projectsSharedCollection = projects));
  }
}
