import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

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
import { IUserGroupAccess } from '../user-group-access.model';
import { UserGroupAccessService } from '../service/user-group-access.service';
import { UserGroupAccessFormService } from './user-group-access-form.service';

import { UserGroupAccessUpdateComponent } from './user-group-access-update.component';

describe('UserGroupAccess Management Update Component', () => {
  let comp: UserGroupAccessUpdateComponent;
  let fixture: ComponentFixture<UserGroupAccessUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userGroupAccessFormService: UserGroupAccessFormService;
  let userGroupAccessService: UserGroupAccessService;
  let areaService: AreaService;
  let brandService: BrandService;
  let audienceService: AudienceService;
  let channelService: ChannelService;
  let countryService: CountryService;
  let userGroupService: UserGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), UserGroupAccessUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(UserGroupAccessUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserGroupAccessUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userGroupAccessFormService = TestBed.inject(UserGroupAccessFormService);
    userGroupAccessService = TestBed.inject(UserGroupAccessService);
    areaService = TestBed.inject(AreaService);
    brandService = TestBed.inject(BrandService);
    audienceService = TestBed.inject(AudienceService);
    channelService = TestBed.inject(ChannelService);
    countryService = TestBed.inject(CountryService);
    userGroupService = TestBed.inject(UserGroupService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Area query and add missing value', () => {
      const userGroupAccess: IUserGroupAccess = { id: 456 };
      const area: IArea = { id: 30432 };
      userGroupAccess.area = area;

      const areaCollection: IArea[] = [{ id: 6978 }];
      jest.spyOn(areaService, 'query').mockReturnValue(of(new HttpResponse({ body: areaCollection })));
      const additionalAreas = [area];
      const expectedCollection: IArea[] = [...additionalAreas, ...areaCollection];
      jest.spyOn(areaService, 'addAreaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userGroupAccess });
      comp.ngOnInit();

      expect(areaService.query).toHaveBeenCalled();
      expect(areaService.addAreaToCollectionIfMissing).toHaveBeenCalledWith(
        areaCollection,
        ...additionalAreas.map(expect.objectContaining),
      );
      expect(comp.areasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Brand query and add missing value', () => {
      const userGroupAccess: IUserGroupAccess = { id: 456 };
      const brand: IBrand = { id: 3256 };
      userGroupAccess.brand = brand;

      const brandCollection: IBrand[] = [{ id: 3329 }];
      jest.spyOn(brandService, 'query').mockReturnValue(of(new HttpResponse({ body: brandCollection })));
      const additionalBrands = [brand];
      const expectedCollection: IBrand[] = [...additionalBrands, ...brandCollection];
      jest.spyOn(brandService, 'addBrandToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userGroupAccess });
      comp.ngOnInit();

      expect(brandService.query).toHaveBeenCalled();
      expect(brandService.addBrandToCollectionIfMissing).toHaveBeenCalledWith(
        brandCollection,
        ...additionalBrands.map(expect.objectContaining),
      );
      expect(comp.brandsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Audience query and add missing value', () => {
      const userGroupAccess: IUserGroupAccess = { id: 456 };
      const audience: IAudience = { id: 30305 };
      userGroupAccess.audience = audience;

      const audienceCollection: IAudience[] = [{ id: 4427 }];
      jest.spyOn(audienceService, 'query').mockReturnValue(of(new HttpResponse({ body: audienceCollection })));
      const additionalAudiences = [audience];
      const expectedCollection: IAudience[] = [...additionalAudiences, ...audienceCollection];
      jest.spyOn(audienceService, 'addAudienceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userGroupAccess });
      comp.ngOnInit();

      expect(audienceService.query).toHaveBeenCalled();
      expect(audienceService.addAudienceToCollectionIfMissing).toHaveBeenCalledWith(
        audienceCollection,
        ...additionalAudiences.map(expect.objectContaining),
      );
      expect(comp.audiencesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Channel query and add missing value', () => {
      const userGroupAccess: IUserGroupAccess = { id: 456 };
      const channel: IChannel = { id: 20058 };
      userGroupAccess.channel = channel;

      const channelCollection: IChannel[] = [{ id: 2888 }];
      jest.spyOn(channelService, 'query').mockReturnValue(of(new HttpResponse({ body: channelCollection })));
      const additionalChannels = [channel];
      const expectedCollection: IChannel[] = [...additionalChannels, ...channelCollection];
      jest.spyOn(channelService, 'addChannelToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userGroupAccess });
      comp.ngOnInit();

      expect(channelService.query).toHaveBeenCalled();
      expect(channelService.addChannelToCollectionIfMissing).toHaveBeenCalledWith(
        channelCollection,
        ...additionalChannels.map(expect.objectContaining),
      );
      expect(comp.channelsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Country query and add missing value', () => {
      const userGroupAccess: IUserGroupAccess = { id: 456 };
      const country: ICountry = { id: 25646 };
      userGroupAccess.country = country;

      const countryCollection: ICountry[] = [{ id: 23546 }];
      jest.spyOn(countryService, 'query').mockReturnValue(of(new HttpResponse({ body: countryCollection })));
      const additionalCountries = [country];
      const expectedCollection: ICountry[] = [...additionalCountries, ...countryCollection];
      jest.spyOn(countryService, 'addCountryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userGroupAccess });
      comp.ngOnInit();

      expect(countryService.query).toHaveBeenCalled();
      expect(countryService.addCountryToCollectionIfMissing).toHaveBeenCalledWith(
        countryCollection,
        ...additionalCountries.map(expect.objectContaining),
      );
      expect(comp.countriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call UserGroup query and add missing value', () => {
      const userGroupAccess: IUserGroupAccess = { id: 456 };
      const userGroup: IUserGroup = { id: 11223 };
      userGroupAccess.userGroup = userGroup;

      const userGroupCollection: IUserGroup[] = [{ id: 31074 }];
      jest.spyOn(userGroupService, 'query').mockReturnValue(of(new HttpResponse({ body: userGroupCollection })));
      const additionalUserGroups = [userGroup];
      const expectedCollection: IUserGroup[] = [...additionalUserGroups, ...userGroupCollection];
      jest.spyOn(userGroupService, 'addUserGroupToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userGroupAccess });
      comp.ngOnInit();

      expect(userGroupService.query).toHaveBeenCalled();
      expect(userGroupService.addUserGroupToCollectionIfMissing).toHaveBeenCalledWith(
        userGroupCollection,
        ...additionalUserGroups.map(expect.objectContaining),
      );
      expect(comp.userGroupsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userGroupAccess: IUserGroupAccess = { id: 456 };
      const area: IArea = { id: 12939 };
      userGroupAccess.area = area;
      const brand: IBrand = { id: 23048 };
      userGroupAccess.brand = brand;
      const audience: IAudience = { id: 18189 };
      userGroupAccess.audience = audience;
      const channel: IChannel = { id: 8729 };
      userGroupAccess.channel = channel;
      const country: ICountry = { id: 6108 };
      userGroupAccess.country = country;
      const userGroup: IUserGroup = { id: 18370 };
      userGroupAccess.userGroup = userGroup;

      activatedRoute.data = of({ userGroupAccess });
      comp.ngOnInit();

      expect(comp.areasSharedCollection).toContain(area);
      expect(comp.brandsSharedCollection).toContain(brand);
      expect(comp.audiencesSharedCollection).toContain(audience);
      expect(comp.channelsSharedCollection).toContain(channel);
      expect(comp.countriesSharedCollection).toContain(country);
      expect(comp.userGroupsSharedCollection).toContain(userGroup);
      expect(comp.userGroupAccess).toEqual(userGroupAccess);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserGroupAccess>>();
      const userGroupAccess = { id: 123 };
      jest.spyOn(userGroupAccessFormService, 'getUserGroupAccess').mockReturnValue(userGroupAccess);
      jest.spyOn(userGroupAccessService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userGroupAccess });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userGroupAccess }));
      saveSubject.complete();

      // THEN
      expect(userGroupAccessFormService.getUserGroupAccess).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userGroupAccessService.update).toHaveBeenCalledWith(expect.objectContaining(userGroupAccess));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserGroupAccess>>();
      const userGroupAccess = { id: 123 };
      jest.spyOn(userGroupAccessFormService, 'getUserGroupAccess').mockReturnValue({ id: null });
      jest.spyOn(userGroupAccessService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userGroupAccess: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userGroupAccess }));
      saveSubject.complete();

      // THEN
      expect(userGroupAccessFormService.getUserGroupAccess).toHaveBeenCalled();
      expect(userGroupAccessService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserGroupAccess>>();
      const userGroupAccess = { id: 123 };
      jest.spyOn(userGroupAccessService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userGroupAccess });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userGroupAccessService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareArea', () => {
      it('Should forward to areaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(areaService, 'compareArea');
        comp.compareArea(entity, entity2);
        expect(areaService.compareArea).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareBrand', () => {
      it('Should forward to brandService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(brandService, 'compareBrand');
        comp.compareBrand(entity, entity2);
        expect(brandService.compareBrand).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAudience', () => {
      it('Should forward to audienceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(audienceService, 'compareAudience');
        comp.compareAudience(entity, entity2);
        expect(audienceService.compareAudience).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareChannel', () => {
      it('Should forward to channelService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(channelService, 'compareChannel');
        comp.compareChannel(entity, entity2);
        expect(channelService.compareChannel).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCountry', () => {
      it('Should forward to countryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(countryService, 'compareCountry');
        comp.compareCountry(entity, entity2);
        expect(countryService.compareCountry).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUserGroup', () => {
      it('Should forward to userGroupService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userGroupService, 'compareUserGroup');
        comp.compareUserGroup(entity, entity2);
        expect(userGroupService.compareUserGroup).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
