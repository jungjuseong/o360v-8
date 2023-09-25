import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';
import { ProjectDateService } from '../service/project-date.service';
import { IProjectDate } from '../project-date.model';
import { ProjectDateFormService } from './project-date-form.service';

import { ProjectDateUpdateComponent } from './project-date-update.component';

describe('ProjectDate Management Update Component', () => {
  let comp: ProjectDateUpdateComponent;
  let fixture: ComponentFixture<ProjectDateUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let projectDateFormService: ProjectDateFormService;
  let projectDateService: ProjectDateService;
  let projectService: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProjectDateUpdateComponent],
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
      .overrideTemplate(ProjectDateUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProjectDateUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    projectDateFormService = TestBed.inject(ProjectDateFormService);
    projectDateService = TestBed.inject(ProjectDateService);
    projectService = TestBed.inject(ProjectService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Project query and add missing value', () => {
      const projectDate: IProjectDate = { id: 456 };
      const project: IProject = { id: 17505 };
      projectDate.project = project;

      const projectCollection: IProject[] = [{ id: 19261 }];
      jest.spyOn(projectService, 'query').mockReturnValue(of(new HttpResponse({ body: projectCollection })));
      const additionalProjects = [project];
      const expectedCollection: IProject[] = [...additionalProjects, ...projectCollection];
      jest.spyOn(projectService, 'addProjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ projectDate });
      comp.ngOnInit();

      expect(projectService.query).toHaveBeenCalled();
      expect(projectService.addProjectToCollectionIfMissing).toHaveBeenCalledWith(
        projectCollection,
        ...additionalProjects.map(expect.objectContaining),
      );
      expect(comp.projectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const projectDate: IProjectDate = { id: 456 };
      const project: IProject = { id: 14963 };
      projectDate.project = project;

      activatedRoute.data = of({ projectDate });
      comp.ngOnInit();

      expect(comp.projectsSharedCollection).toContain(project);
      expect(comp.projectDate).toEqual(projectDate);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProjectDate>>();
      const projectDate = { id: 123 };
      jest.spyOn(projectDateFormService, 'getProjectDate').mockReturnValue(projectDate);
      jest.spyOn(projectDateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectDate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: projectDate }));
      saveSubject.complete();

      // THEN
      expect(projectDateFormService.getProjectDate).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(projectDateService.update).toHaveBeenCalledWith(expect.objectContaining(projectDate));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProjectDate>>();
      const projectDate = { id: 123 };
      jest.spyOn(projectDateFormService, 'getProjectDate').mockReturnValue({ id: null });
      jest.spyOn(projectDateService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectDate: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: projectDate }));
      saveSubject.complete();

      // THEN
      expect(projectDateFormService.getProjectDate).toHaveBeenCalled();
      expect(projectDateService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProjectDate>>();
      const projectDate = { id: 123 };
      jest.spyOn(projectDateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectDate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(projectDateService.update).toHaveBeenCalled();
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
  });
});
