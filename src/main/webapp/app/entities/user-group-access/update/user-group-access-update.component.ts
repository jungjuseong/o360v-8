import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IArea } from 'app/entities/area/area.model';
import { AreaService } from 'app/entities/area/service/area.service';
import { IBrand } from 'app/entities/brand/brand.model';
import { BrandService } from 'app/entities/brand/service/brand.service';
import { IAudience } from 'app/entities/audience/audience.model';
import { AudienceService } from 'app/entities/audience/service/audience.service';
import { IChannel } from 'app/entities/channel/channel.model';
import { ChannelService } from 'app/entities/channel/service/channel.service';
import { ICountry } from 'app/entities/country/country.model';
import { CountryService } from 'app/entities/country/service/country.service';
import { IUserGroup } from 'app/entities/user-group/user-group.model';
import { UserGroupService } from 'app/entities/user-group/service/user-group.service';
import { UserGroupAccessService } from '../service/user-group-access.service';
import { IUserGroupAccess } from '../user-group-access.model';
import { UserGroupAccessFormService, UserGroupAccessFormGroup } from './user-group-access-form.service';

@Component({
  standalone: true,
  selector: 'jhi-user-group-access-update',
  templateUrl: './user-group-access-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class UserGroupAccessUpdateComponent implements OnInit {
  isSaving = false;
  userGroupAccess: IUserGroupAccess | null = null;

  areasSharedCollection: IArea[] = [];
  brandsSharedCollection: IBrand[] = [];
  audiencesSharedCollection: IAudience[] = [];
  channelsSharedCollection: IChannel[] = [];
  countriesSharedCollection: ICountry[] = [];
  userGroupsSharedCollection: IUserGroup[] = [];

  editForm: UserGroupAccessFormGroup = this.userGroupAccessFormService.createUserGroupAccessFormGroup();

  constructor(
    protected userGroupAccessService: UserGroupAccessService,
    protected userGroupAccessFormService: UserGroupAccessFormService,
    protected areaService: AreaService,
    protected brandService: BrandService,
    protected audienceService: AudienceService,
    protected channelService: ChannelService,
    protected countryService: CountryService,
    protected userGroupService: UserGroupService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareArea = (o1: IArea | null, o2: IArea | null): boolean => this.areaService.compareArea(o1, o2);

  compareBrand = (o1: IBrand | null, o2: IBrand | null): boolean => this.brandService.compareBrand(o1, o2);

  compareAudience = (o1: IAudience | null, o2: IAudience | null): boolean => this.audienceService.compareAudience(o1, o2);

  compareChannel = (o1: IChannel | null, o2: IChannel | null): boolean => this.channelService.compareChannel(o1, o2);

  compareCountry = (o1: ICountry | null, o2: ICountry | null): boolean => this.countryService.compareCountry(o1, o2);

  compareUserGroup = (o1: IUserGroup | null, o2: IUserGroup | null): boolean => this.userGroupService.compareUserGroup(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userGroupAccess }) => {
      this.userGroupAccess = userGroupAccess;
      if (userGroupAccess) {
        this.updateForm(userGroupAccess);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userGroupAccess = this.userGroupAccessFormService.getUserGroupAccess(this.editForm);
    if (userGroupAccess.id !== null) {
      this.subscribeToSaveResponse(this.userGroupAccessService.update(userGroupAccess));
    } else {
      this.subscribeToSaveResponse(this.userGroupAccessService.create(userGroupAccess));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserGroupAccess>>): void {
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

  protected updateForm(userGroupAccess: IUserGroupAccess): void {
    this.userGroupAccess = userGroupAccess;
    this.userGroupAccessFormService.resetForm(this.editForm, userGroupAccess);

    this.areasSharedCollection = this.areaService.addAreaToCollectionIfMissing<IArea>(this.areasSharedCollection, userGroupAccess.area);
    this.brandsSharedCollection = this.brandService.addBrandToCollectionIfMissing<IBrand>(
      this.brandsSharedCollection,
      userGroupAccess.brand,
    );
    this.audiencesSharedCollection = this.audienceService.addAudienceToCollectionIfMissing<IAudience>(
      this.audiencesSharedCollection,
      userGroupAccess.audience,
    );
    this.channelsSharedCollection = this.channelService.addChannelToCollectionIfMissing<IChannel>(
      this.channelsSharedCollection,
      userGroupAccess.channel,
    );
    this.countriesSharedCollection = this.countryService.addCountryToCollectionIfMissing<ICountry>(
      this.countriesSharedCollection,
      userGroupAccess.country,
    );
    this.userGroupsSharedCollection = this.userGroupService.addUserGroupToCollectionIfMissing<IUserGroup>(
      this.userGroupsSharedCollection,
      userGroupAccess.userGroup,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.areaService
      .query()
      .pipe(map((res: HttpResponse<IArea[]>) => res.body ?? []))
      .pipe(map((areas: IArea[]) => this.areaService.addAreaToCollectionIfMissing<IArea>(areas, this.userGroupAccess?.area)))
      .subscribe((areas: IArea[]) => (this.areasSharedCollection = areas));

    this.brandService
      .query()
      .pipe(map((res: HttpResponse<IBrand[]>) => res.body ?? []))
      .pipe(map((brands: IBrand[]) => this.brandService.addBrandToCollectionIfMissing<IBrand>(brands, this.userGroupAccess?.brand)))
      .subscribe((brands: IBrand[]) => (this.brandsSharedCollection = brands));

    this.audienceService
      .query()
      .pipe(map((res: HttpResponse<IAudience[]>) => res.body ?? []))
      .pipe(
        map((audiences: IAudience[]) =>
          this.audienceService.addAudienceToCollectionIfMissing<IAudience>(audiences, this.userGroupAccess?.audience),
        ),
      )
      .subscribe((audiences: IAudience[]) => (this.audiencesSharedCollection = audiences));

    this.channelService
      .query()
      .pipe(map((res: HttpResponse<IChannel[]>) => res.body ?? []))
      .pipe(
        map((channels: IChannel[]) =>
          this.channelService.addChannelToCollectionIfMissing<IChannel>(channels, this.userGroupAccess?.channel),
        ),
      )
      .subscribe((channels: IChannel[]) => (this.channelsSharedCollection = channels));

    this.countryService
      .query()
      .pipe(map((res: HttpResponse<ICountry[]>) => res.body ?? []))
      .pipe(
        map((countries: ICountry[]) =>
          this.countryService.addCountryToCollectionIfMissing<ICountry>(countries, this.userGroupAccess?.country),
        ),
      )
      .subscribe((countries: ICountry[]) => (this.countriesSharedCollection = countries));

    this.userGroupService
      .query()
      .pipe(map((res: HttpResponse<IUserGroup[]>) => res.body ?? []))
      .pipe(
        map((userGroups: IUserGroup[]) =>
          this.userGroupService.addUserGroupToCollectionIfMissing<IUserGroup>(userGroups, this.userGroupAccess?.userGroup),
        ),
      )
      .subscribe((userGroups: IUserGroup[]) => (this.userGroupsSharedCollection = userGroups));
  }
}
