import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/service/country.service';
import { IProjectGoal } from 'app/entities/project-goal/project-goal.model';
import { ProjectGoalService } from 'app/entities/project-goal/service/project-goal.service';
import { IChannel } from 'app/entities/channel/channel.model';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { ICostCenter } from 'app/entities/cost-center/cost-center.model';
import { CostCenterService } from 'app/entities/cost-center/service/cost-center.service';
import { IAccountNumber } from 'app/entities/account-number/account-number.model';
import { AccountNumberService } from 'app/entities/account-number/service/account-number.service';
import { IProjectOwner } from 'app/entities/project-owner/project-owner.model';
import { ProjectOwnerService } from 'app/entities/project-owner/service/project-owner.service';
import { ProjectStatus } from 'app/entities/enumerations/project-status.model';
import { ProjectFinancialStatus } from 'app/entities/enumerations/project-financial-status.model';
import { ProjectService } from '../service/project.service';
import { IProject } from '../project.model';
import { ProjectFormService, ProjectFormGroup } from './project-form.service';

@Component({
  standalone: true,
  selector: 'jhi-project-update',
  templateUrl: './project-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProjectUpdateComponent implements OnInit {
  isSaving = false;
  project: IProject | null = null;
  projectStatusValues = Object.keys(ProjectStatus);
  projectFinancialStatusValues = Object.keys(ProjectFinancialStatus);

  projectsSharedCollection: IProject[] = [];
  countriesSharedCollection: ICountry[] = [];
  projectGoalsSharedCollection: IProjectGoal[] = [];
  channelsSharedCollection: IChannel[] = [];
  costCentersSharedCollection: ICostCenter[] = [];
  accountNumbersSharedCollection: IAccountNumber[] = [];
  projectOwnersSharedCollection: IProjectOwner[] = [];

  editForm: ProjectFormGroup = this.projectFormService.createProjectFormGroup();

  constructor(
    protected projectService: ProjectService,
    protected projectFormService: ProjectFormService,
    protected countryService: CountryService,
    protected projectGoalService: ProjectGoalService,
    protected channelService: ChannelService,
    protected costCenterService: CostCenterService,
    protected accountNumberService: AccountNumberService,
    protected projectOwnerService: ProjectOwnerService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareProject = (o1: IProject | null, o2: IProject | null): boolean => this.projectService.compareProject(o1, o2);

  compareCountry = (o1: ICountry | null, o2: ICountry | null): boolean => this.countryService.compareCountry(o1, o2);

  compareProjectGoal = (o1: IProjectGoal | null, o2: IProjectGoal | null): boolean => this.projectGoalService.compareProjectGoal(o1, o2);

  compareChannel = (o1: IChannel | null, o2: IChannel | null): boolean => this.channelService.compareChannel(o1, o2);

  compareCostCenter = (o1: ICostCenter | null, o2: ICostCenter | null): boolean => this.costCenterService.compareCostCenter(o1, o2);

  compareAccountNumber = (o1: IAccountNumber | null, o2: IAccountNumber | null): boolean =>
    this.accountNumberService.compareAccountNumber(o1, o2);

  compareProjectOwner = (o1: IProjectOwner | null, o2: IProjectOwner | null): boolean =>
    this.projectOwnerService.compareProjectOwner(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ project }) => {
      this.project = project;
      if (project) {
        this.updateForm(project);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const project = this.projectFormService.getProject(this.editForm);
    if (project.id !== null) {
      this.subscribeToSaveResponse(this.projectService.update(project));
    } else {
      this.subscribeToSaveResponse(this.projectService.create(project));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProject>>): void {
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

  protected updateForm(project: IProject): void {
    this.project = project;
    this.projectFormService.resetForm(this.editForm, project);

    this.projectsSharedCollection = this.projectService.addProjectToCollectionIfMissing<IProject>(
      this.projectsSharedCollection,
      project.parentProject,
    );
    this.countriesSharedCollection = this.countryService.addCountryToCollectionIfMissing<ICountry>(
      this.countriesSharedCollection,
      ...(project.countries ?? []),
    );
    this.projectGoalsSharedCollection = this.projectGoalService.addProjectGoalToCollectionIfMissing<IProjectGoal>(
      this.projectGoalsSharedCollection,
      project.goal,
    );
    this.channelsSharedCollection = this.channelService.addChannelToCollectionIfMissing<IChannel>(
      this.channelsSharedCollection,
      project.channel,
    );
    this.costCentersSharedCollection = this.costCenterService.addCostCenterToCollectionIfMissing<ICostCenter>(
      this.costCentersSharedCollection,
      project.costCenter,
    );
    this.accountNumbersSharedCollection = this.accountNumberService.addAccountNumberToCollectionIfMissing<IAccountNumber>(
      this.accountNumbersSharedCollection,
      project.accountNumber,
    );
    this.projectOwnersSharedCollection = this.projectOwnerService.addProjectOwnerToCollectionIfMissing<IProjectOwner>(
      this.projectOwnersSharedCollection,
      project.projectOwner,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.projectService
      .query()
      .pipe(map((res: HttpResponse<IProject[]>) => res.body ?? []))
      .pipe(
        map((projects: IProject[]) => this.projectService.addProjectToCollectionIfMissing<IProject>(projects, this.project?.parentProject)),
      )
      .subscribe((projects: IProject[]) => (this.projectsSharedCollection = projects));

    this.countryService
      .query()
      .pipe(map((res: HttpResponse<ICountry[]>) => res.body ?? []))
      .pipe(
        map((countries: ICountry[]) =>
          this.countryService.addCountryToCollectionIfMissing<ICountry>(countries, ...(this.project?.countries ?? [])),
        ),
      )
      .subscribe((countries: ICountry[]) => (this.countriesSharedCollection = countries));

    this.projectGoalService
      .query()
      .pipe(map((res: HttpResponse<IProjectGoal[]>) => res.body ?? []))
      .pipe(
        map((projectGoals: IProjectGoal[]) =>
          this.projectGoalService.addProjectGoalToCollectionIfMissing<IProjectGoal>(projectGoals, this.project?.goal),
        ),
      )
      .subscribe((projectGoals: IProjectGoal[]) => (this.projectGoalsSharedCollection = projectGoals));

    this.channelService
      .query()
      .pipe(map((res: HttpResponse<IChannel[]>) => res.body ?? []))
      .pipe(map((channels: IChannel[]) => this.channelService.addChannelToCollectionIfMissing<IChannel>(channels, this.project?.channel)))
      .subscribe((channels: IChannel[]) => (this.channelsSharedCollection = channels));

    this.costCenterService
      .query()
      .pipe(map((res: HttpResponse<ICostCenter[]>) => res.body ?? []))
      .pipe(
        map((costCenters: ICostCenter[]) =>
          this.costCenterService.addCostCenterToCollectionIfMissing<ICostCenter>(costCenters, this.project?.costCenter),
        ),
      )
      .subscribe((costCenters: ICostCenter[]) => (this.costCentersSharedCollection = costCenters));

    this.accountNumberService
      .query()
      .pipe(map((res: HttpResponse<IAccountNumber[]>) => res.body ?? []))
      .pipe(
        map((accountNumbers: IAccountNumber[]) =>
          this.accountNumberService.addAccountNumberToCollectionIfMissing<IAccountNumber>(accountNumbers, this.project?.accountNumber),
        ),
      )
      .subscribe((accountNumbers: IAccountNumber[]) => (this.accountNumbersSharedCollection = accountNumbers));

    this.projectOwnerService
      .query()
      .pipe(map((res: HttpResponse<IProjectOwner[]>) => res.body ?? []))
      .pipe(
        map((projectOwners: IProjectOwner[]) =>
          this.projectOwnerService.addProjectOwnerToCollectionIfMissing<IProjectOwner>(projectOwners, this.project?.projectOwner),
        ),
      )
      .subscribe((projectOwners: IProjectOwner[]) => (this.projectOwnersSharedCollection = projectOwners));
  }
}
