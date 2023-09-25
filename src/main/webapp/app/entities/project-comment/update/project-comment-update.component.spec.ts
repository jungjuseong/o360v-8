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
import { IProjectComment } from '../project-comment.model';
import { ProjectCommentService } from '../service/project-comment.service';
import { ProjectCommentFormService } from './project-comment-form.service';

import { ProjectCommentUpdateComponent } from './project-comment-update.component';

describe('ProjectComment Management Update Component', () => {
  let comp: ProjectCommentUpdateComponent;
  let fixture: ComponentFixture<ProjectCommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let projectCommentFormService: ProjectCommentFormService;
  let projectCommentService: ProjectCommentService;
  let userService: UserService;
  let projectService: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProjectCommentUpdateComponent],
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
      .overrideTemplate(ProjectCommentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProjectCommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    projectCommentFormService = TestBed.inject(ProjectCommentFormService);
    projectCommentService = TestBed.inject(ProjectCommentService);
    userService = TestBed.inject(UserService);
    projectService = TestBed.inject(ProjectService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const projectComment: IProjectComment = { id: 456 };
      const user: IUser = { id: 'fc9942a8-ec90-4f56-93d5-42c7ce1b0829' };
      projectComment.user = user;

      const userCollection: IUser[] = [{ id: 'f8d16c5f-9ac7-471b-9a8b-76605be69a51' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ projectComment });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Project query and add missing value', () => {
      const projectComment: IProjectComment = { id: 456 };
      const project: IProject = { id: 4755 };
      projectComment.project = project;

      const projectCollection: IProject[] = [{ id: 17955 }];
      jest.spyOn(projectService, 'query').mockReturnValue(of(new HttpResponse({ body: projectCollection })));
      const additionalProjects = [project];
      const expectedCollection: IProject[] = [...additionalProjects, ...projectCollection];
      jest.spyOn(projectService, 'addProjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ projectComment });
      comp.ngOnInit();

      expect(projectService.query).toHaveBeenCalled();
      expect(projectService.addProjectToCollectionIfMissing).toHaveBeenCalledWith(
        projectCollection,
        ...additionalProjects.map(expect.objectContaining),
      );
      expect(comp.projectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const projectComment: IProjectComment = { id: 456 };
      const user: IUser = { id: '7a710b6e-44ff-4a05-a6a9-b2cf71e58814' };
      projectComment.user = user;
      const project: IProject = { id: 7112 };
      projectComment.project = project;

      activatedRoute.data = of({ projectComment });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.projectsSharedCollection).toContain(project);
      expect(comp.projectComment).toEqual(projectComment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProjectComment>>();
      const projectComment = { id: 123 };
      jest.spyOn(projectCommentFormService, 'getProjectComment').mockReturnValue(projectComment);
      jest.spyOn(projectCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: projectComment }));
      saveSubject.complete();

      // THEN
      expect(projectCommentFormService.getProjectComment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(projectCommentService.update).toHaveBeenCalledWith(expect.objectContaining(projectComment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProjectComment>>();
      const projectComment = { id: 123 };
      jest.spyOn(projectCommentFormService, 'getProjectComment').mockReturnValue({ id: null });
      jest.spyOn(projectCommentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectComment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: projectComment }));
      saveSubject.complete();

      // THEN
      expect(projectCommentFormService.getProjectComment).toHaveBeenCalled();
      expect(projectCommentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProjectComment>>();
      const projectComment = { id: 123 };
      jest.spyOn(projectCommentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectComment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(projectCommentService.update).toHaveBeenCalled();
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
