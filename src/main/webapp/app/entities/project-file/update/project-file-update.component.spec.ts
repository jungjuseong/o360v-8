import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';
import { ProjectFileService } from '../service/project-file.service';
import { IProjectFile } from '../project-file.model';
import { ProjectFileFormService } from './project-file-form.service';

import { ProjectFileUpdateComponent } from './project-file-update.component';

describe('ProjectFile Management Update Component', () => {
  let comp: ProjectFileUpdateComponent;
  let fixture: ComponentFixture<ProjectFileUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let projectFileFormService: ProjectFileFormService;
  let projectFileService: ProjectFileService;
  let projectService: ProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProjectFileUpdateComponent],
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
      .overrideTemplate(ProjectFileUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProjectFileUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    projectFileFormService = TestBed.inject(ProjectFileFormService);
    projectFileService = TestBed.inject(ProjectFileService);
    projectService = TestBed.inject(ProjectService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Project query and add missing value', () => {
      const projectFile: IProjectFile = { id: 456 };
      const project: IProject = { id: 30646 };
      projectFile.project = project;

      const projectCollection: IProject[] = [{ id: 405 }];
      jest.spyOn(projectService, 'query').mockReturnValue(of(new HttpResponse({ body: projectCollection })));
      const additionalProjects = [project];
      const expectedCollection: IProject[] = [...additionalProjects, ...projectCollection];
      jest.spyOn(projectService, 'addProjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ projectFile });
      comp.ngOnInit();

      expect(projectService.query).toHaveBeenCalled();
      expect(projectService.addProjectToCollectionIfMissing).toHaveBeenCalledWith(
        projectCollection,
        ...additionalProjects.map(expect.objectContaining),
      );
      expect(comp.projectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const projectFile: IProjectFile = { id: 456 };
      const project: IProject = { id: 28022 };
      projectFile.project = project;

      activatedRoute.data = of({ projectFile });
      comp.ngOnInit();

      expect(comp.projectsSharedCollection).toContain(project);
      expect(comp.projectFile).toEqual(projectFile);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProjectFile>>();
      const projectFile = { id: 123 };
      jest.spyOn(projectFileFormService, 'getProjectFile').mockReturnValue(projectFile);
      jest.spyOn(projectFileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectFile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: projectFile }));
      saveSubject.complete();

      // THEN
      expect(projectFileFormService.getProjectFile).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(projectFileService.update).toHaveBeenCalledWith(expect.objectContaining(projectFile));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProjectFile>>();
      const projectFile = { id: 123 };
      jest.spyOn(projectFileFormService, 'getProjectFile').mockReturnValue({ id: null });
      jest.spyOn(projectFileService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectFile: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: projectFile }));
      saveSubject.complete();

      // THEN
      expect(projectFileFormService.getProjectFile).toHaveBeenCalled();
      expect(projectFileService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProjectFile>>();
      const projectFile = { id: 123 };
      jest.spyOn(projectFileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectFile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(projectFileService.update).toHaveBeenCalled();
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
