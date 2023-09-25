import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProjectOwnerService } from '../service/project-owner.service';
import { IProjectOwner } from '../project-owner.model';
import { ProjectOwnerFormService } from './project-owner-form.service';

import { ProjectOwnerUpdateComponent } from './project-owner-update.component';

describe('ProjectOwner Management Update Component', () => {
  let comp: ProjectOwnerUpdateComponent;
  let fixture: ComponentFixture<ProjectOwnerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let projectOwnerFormService: ProjectOwnerFormService;
  let projectOwnerService: ProjectOwnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProjectOwnerUpdateComponent],
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
      .overrideTemplate(ProjectOwnerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProjectOwnerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    projectOwnerFormService = TestBed.inject(ProjectOwnerFormService);
    projectOwnerService = TestBed.inject(ProjectOwnerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const projectOwner: IProjectOwner = { id: 456 };

      activatedRoute.data = of({ projectOwner });
      comp.ngOnInit();

      expect(comp.projectOwner).toEqual(projectOwner);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProjectOwner>>();
      const projectOwner = { id: 123 };
      jest.spyOn(projectOwnerFormService, 'getProjectOwner').mockReturnValue(projectOwner);
      jest.spyOn(projectOwnerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectOwner });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: projectOwner }));
      saveSubject.complete();

      // THEN
      expect(projectOwnerFormService.getProjectOwner).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(projectOwnerService.update).toHaveBeenCalledWith(expect.objectContaining(projectOwner));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProjectOwner>>();
      const projectOwner = { id: 123 };
      jest.spyOn(projectOwnerFormService, 'getProjectOwner').mockReturnValue({ id: null });
      jest.spyOn(projectOwnerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectOwner: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: projectOwner }));
      saveSubject.complete();

      // THEN
      expect(projectOwnerFormService.getProjectOwner).toHaveBeenCalled();
      expect(projectOwnerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProjectOwner>>();
      const projectOwner = { id: 123 };
      jest.spyOn(projectOwnerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectOwner });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(projectOwnerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
