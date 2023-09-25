import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

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
import { IProject } from '../project.model';
import { ProjectService } from '../service/project.service';
import { ProjectFormService } from './project-form.service';

import { ProjectUpdateComponent } from './project-update.component';

describe('Project Management Update Component', () => {
  let comp: ProjectUpdateComponent;
  let fixture: ComponentFixture<ProjectUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let projectFormService: ProjectFormService;
  let projectService: ProjectService;
  let countryService: CountryService;
  let projectGoalService: ProjectGoalService;
  let channelService: ChannelService;
  let costCenterService: CostCenterService;
  let accountNumberService: AccountNumberService;
  let projectOwnerService: ProjectOwnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProjectUpdateComponent],
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
      .overrideTemplate(ProjectUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProjectUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    projectFormService = TestBed.inject(ProjectFormService);
    projectService = TestBed.inject(ProjectService);
    countryService = TestBed.inject(CountryService);
    projectGoalService = TestBed.inject(ProjectGoalService);
    channelService = TestBed.inject(ChannelService);
    costCenterService = TestBed.inject(CostCenterService);
    accountNumberService = TestBed.inject(AccountNumberService);
    projectOwnerService = TestBed.inject(ProjectOwnerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Project query and add missing value', () => {
      const project: IProject = { id: 456 };
      const parentProject: IProject = { id: 7078 };
      project.parentProject = parentProject;

      const projectCollection: IProject[] = [{ id: 14091 }];
      jest.spyOn(projectService, 'query').mockReturnValue(of(new HttpResponse({ body: projectCollection })));
      const additionalProjects = [parentProject];
      const expectedCollection: IProject[] = [...additionalProjects, ...projectCollection];
      jest.spyOn(projectService, 'addProjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ project });
      comp.ngOnInit();

      expect(projectService.query).toHaveBeenCalled();
      expect(projectService.addProjectToCollectionIfMissing).toHaveBeenCalledWith(
        projectCollection,
        ...additionalProjects.map(expect.objectContaining),
      );
      expect(comp.projectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Country query and add missing value', () => {
      const project: IProject = { id: 456 };
      const countries: ICountry[] = [{ id: 19487 }];
      project.countries = countries;

      const countryCollection: ICountry[] = [{ id: 7930 }];
      jest.spyOn(countryService, 'query').mockReturnValue(of(new HttpResponse({ body: countryCollection })));
      const additionalCountries = [...countries];
      const expectedCollection: ICountry[] = [...additionalCountries, ...countryCollection];
      jest.spyOn(countryService, 'addCountryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ project });
      comp.ngOnInit();

      expect(countryService.query).toHaveBeenCalled();
      expect(countryService.addCountryToCollectionIfMissing).toHaveBeenCalledWith(
        countryCollection,
        ...additionalCountries.map(expect.objectContaining),
      );
      expect(comp.countriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ProjectGoal query and add missing value', () => {
      const project: IProject = { id: 456 };
      const goal: IProjectGoal = { id: 2931 };
      project.goal = goal;

      const projectGoalCollection: IProjectGoal[] = [{ id: 1836 }];
      jest.spyOn(projectGoalService, 'query').mockReturnValue(of(new HttpResponse({ body: projectGoalCollection })));
      const additionalProjectGoals = [goal];
      const expectedCollection: IProjectGoal[] = [...additionalProjectGoals, ...projectGoalCollection];
      jest.spyOn(projectGoalService, 'addProjectGoalToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ project });
      comp.ngOnInit();

      expect(projectGoalService.query).toHaveBeenCalled();
      expect(projectGoalService.addProjectGoalToCollectionIfMissing).toHaveBeenCalledWith(
        projectGoalCollection,
        ...additionalProjectGoals.map(expect.objectContaining),
      );
      expect(comp.projectGoalsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Channel query and add missing value', () => {
      const project: IProject = { id: 456 };
      const channel: IChannel = { id: 14800 };
      project.channel = channel;

      const channelCollection: IChannel[] = [{ id: 25477 }];
      jest.spyOn(channelService, 'query').mockReturnValue(of(new HttpResponse({ body: channelCollection })));
      const additionalChannels = [channel];
      const expectedCollection: IChannel[] = [...additionalChannels, ...channelCollection];
      jest.spyOn(channelService, 'addChannelToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ project });
      comp.ngOnInit();

      expect(channelService.query).toHaveBeenCalled();
      expect(channelService.addChannelToCollectionIfMissing).toHaveBeenCalledWith(
        channelCollection,
        ...additionalChannels.map(expect.objectContaining),
      );
      expect(comp.channelsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CostCenter query and add missing value', () => {
      const project: IProject = { id: 456 };
      const costCenter: ICostCenter = { id: 1984 };
      project.costCenter = costCenter;

      const costCenterCollection: ICostCenter[] = [{ id: 27804 }];
      jest.spyOn(costCenterService, 'query').mockReturnValue(of(new HttpResponse({ body: costCenterCollection })));
      const additionalCostCenters = [costCenter];
      const expectedCollection: ICostCenter[] = [...additionalCostCenters, ...costCenterCollection];
      jest.spyOn(costCenterService, 'addCostCenterToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ project });
      comp.ngOnInit();

      expect(costCenterService.query).toHaveBeenCalled();
      expect(costCenterService.addCostCenterToCollectionIfMissing).toHaveBeenCalledWith(
        costCenterCollection,
        ...additionalCostCenters.map(expect.objectContaining),
      );
      expect(comp.costCentersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call AccountNumber query and add missing value', () => {
      const project: IProject = { id: 456 };
      const accountNumber: IAccountNumber = { id: 6922 };
      project.accountNumber = accountNumber;

      const accountNumberCollection: IAccountNumber[] = [{ id: 9193 }];
      jest.spyOn(accountNumberService, 'query').mockReturnValue(of(new HttpResponse({ body: accountNumberCollection })));
      const additionalAccountNumbers = [accountNumber];
      const expectedCollection: IAccountNumber[] = [...additionalAccountNumbers, ...accountNumberCollection];
      jest.spyOn(accountNumberService, 'addAccountNumberToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ project });
      comp.ngOnInit();

      expect(accountNumberService.query).toHaveBeenCalled();
      expect(accountNumberService.addAccountNumberToCollectionIfMissing).toHaveBeenCalledWith(
        accountNumberCollection,
        ...additionalAccountNumbers.map(expect.objectContaining),
      );
      expect(comp.accountNumbersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ProjectOwner query and add missing value', () => {
      const project: IProject = { id: 456 };
      const projectOwner: IProjectOwner = { id: 1526 };
      project.projectOwner = projectOwner;

      const projectOwnerCollection: IProjectOwner[] = [{ id: 15654 }];
      jest.spyOn(projectOwnerService, 'query').mockReturnValue(of(new HttpResponse({ body: projectOwnerCollection })));
      const additionalProjectOwners = [projectOwner];
      const expectedCollection: IProjectOwner[] = [...additionalProjectOwners, ...projectOwnerCollection];
      jest.spyOn(projectOwnerService, 'addProjectOwnerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ project });
      comp.ngOnInit();

      expect(projectOwnerService.query).toHaveBeenCalled();
      expect(projectOwnerService.addProjectOwnerToCollectionIfMissing).toHaveBeenCalledWith(
        projectOwnerCollection,
        ...additionalProjectOwners.map(expect.objectContaining),
      );
      expect(comp.projectOwnersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const project: IProject = { id: 456 };
      const parentProject: IProject = { id: 10527 };
      project.parentProject = parentProject;
      const country: ICountry = { id: 1630 };
      project.countries = [country];
      const goal: IProjectGoal = { id: 17783 };
      project.goal = goal;
      const channel: IChannel = { id: 7464 };
      project.channel = channel;
      const costCenter: ICostCenter = { id: 14398 };
      project.costCenter = costCenter;
      const accountNumber: IAccountNumber = { id: 2278 };
      project.accountNumber = accountNumber;
      const projectOwner: IProjectOwner = { id: 22304 };
      project.projectOwner = projectOwner;

      activatedRoute.data = of({ project });
      comp.ngOnInit();

      expect(comp.projectsSharedCollection).toContain(parentProject);
      expect(comp.countriesSharedCollection).toContain(country);
      expect(comp.projectGoalsSharedCollection).toContain(goal);
      expect(comp.channelsSharedCollection).toContain(channel);
      expect(comp.costCentersSharedCollection).toContain(costCenter);
      expect(comp.accountNumbersSharedCollection).toContain(accountNumber);
      expect(comp.projectOwnersSharedCollection).toContain(projectOwner);
      expect(comp.project).toEqual(project);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProject>>();
      const project = { id: 123 };
      jest.spyOn(projectFormService, 'getProject').mockReturnValue(project);
      jest.spyOn(projectService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ project });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: project }));
      saveSubject.complete();

      // THEN
      expect(projectFormService.getProject).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(projectService.update).toHaveBeenCalledWith(expect.objectContaining(project));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProject>>();
      const project = { id: 123 };
      jest.spyOn(projectFormService, 'getProject').mockReturnValue({ id: null });
      jest.spyOn(projectService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ project: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: project }));
      saveSubject.complete();

      // THEN
      expect(projectFormService.getProject).toHaveBeenCalled();
      expect(projectService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProject>>();
      const project = { id: 123 };
      jest.spyOn(projectService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ project });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(projectService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProject', () => {
      it('Should forward to projectService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(projectService, 'compareProject');
        comp.compareProject(entity, entity2);
        expect(projectService.compareProject).toHaveBeenCalledWith(entity, entity2);
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

    describe('compareProjectGoal', () => {
      it('Should forward to projectGoalService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(projectGoalService, 'compareProjectGoal');
        comp.compareProjectGoal(entity, entity2);
        expect(projectGoalService.compareProjectGoal).toHaveBeenCalledWith(entity, entity2);
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

    describe('compareCostCenter', () => {
      it('Should forward to costCenterService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(costCenterService, 'compareCostCenter');
        comp.compareCostCenter(entity, entity2);
        expect(costCenterService.compareCostCenter).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareAccountNumber', () => {
      it('Should forward to accountNumberService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(accountNumberService, 'compareAccountNumber');
        comp.compareAccountNumber(entity, entity2);
        expect(accountNumberService.compareAccountNumber).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareProjectOwner', () => {
      it('Should forward to projectOwnerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(projectOwnerService, 'compareProjectOwner');
        comp.compareProjectOwner(entity, entity2);
        expect(projectOwnerService.compareProjectOwner).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
