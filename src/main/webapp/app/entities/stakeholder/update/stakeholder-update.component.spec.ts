import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';
import { IStakeholder } from '../stakeholder.model';
import { StakeholderService } from '../service/stakeholder.service';
import { StakeholderFormService } from './stakeholder-form.service';

import { StakeholderUpdateComponent } from './stakeholder-update.component';

describe('Stakeholder Management Update Component', () => {
  let comp: StakeholderUpdateComponent;
  let fixture: ComponentFixture<StakeholderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let stakeholderFormService: StakeholderFormService;
  let stakeholderService: StakeholderService;
  let userService: UserService;
  let projectService: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), StakeholderUpdateComponent],
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
      .overrideTemplate(StakeholderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StakeholderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    stakeholderFormService = TestBed.inject(StakeholderFormService);
    stakeholderService = TestBed.inject(StakeholderService);
    userService = TestBed.inject(UserService);
    projectService = TestBed.inject(ProjectService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const stakeholder: IStakeholder = { id: 456 };
      const users: IUser[] = [{ id: 'dd003e2a-2a78-41d4-84b2-32ca7bd01937' }];
      stakeholder.users = users;

      const userCollection: IUser[] = [{ id: 'a18b5b80-34cc-4346-b2f4-1e17f783eaa1' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [...users];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ stakeholder });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Project query and add missing value', () => {
      const stakeholder: IStakeholder = { id: 456 };
      const project: IProject = { id: 24144 };
      stakeholder.project = project;

      const projectCollection: IProject[] = [{ id: 20621 }];
      jest.spyOn(projectService, 'query').mockReturnValue(of(new HttpResponse({ body: projectCollection })));
      const additionalProjects = [project];
      const expectedCollection: IProject[] = [...additionalProjects, ...projectCollection];
      jest.spyOn(projectService, 'addProjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ stakeholder });
      comp.ngOnInit();

      expect(projectService.query).toHaveBeenCalled();
      expect(projectService.addProjectToCollectionIfMissing).toHaveBeenCalledWith(
        projectCollection,
        ...additionalProjects.map(expect.objectContaining),
      );
      expect(comp.projectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const stakeholder: IStakeholder = { id: 456 };
      const user: IUser = { id: '2b1c4128-7184-465f-8a40-2b0b62d25638' };
      stakeholder.users = [user];
      const project: IProject = { id: 24256 };
      stakeholder.project = project;

      activatedRoute.data = of({ stakeholder });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.projectsSharedCollection).toContain(project);
      expect(comp.stakeholder).toEqual(stakeholder);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStakeholder>>();
      const stakeholder = { id: 123 };
      jest.spyOn(stakeholderFormService, 'getStakeholder').mockReturnValue(stakeholder);
      jest.spyOn(stakeholderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stakeholder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stakeholder }));
      saveSubject.complete();

      // THEN
      expect(stakeholderFormService.getStakeholder).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(stakeholderService.update).toHaveBeenCalledWith(expect.objectContaining(stakeholder));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStakeholder>>();
      const stakeholder = { id: 123 };
      jest.spyOn(stakeholderFormService, 'getStakeholder').mockReturnValue({ id: null });
      jest.spyOn(stakeholderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stakeholder: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: stakeholder }));
      saveSubject.complete();

      // THEN
      expect(stakeholderFormService.getStakeholder).toHaveBeenCalled();
      expect(stakeholderService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStakeholder>>();
      const stakeholder = { id: 123 };
      jest.spyOn(stakeholderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ stakeholder });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(stakeholderService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareProject', () => {
      it('Should forward to projectService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(projectService, 'compareProject');
        comp.compareProject(entity, entity2);
        expect(projectService.compareProject).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
