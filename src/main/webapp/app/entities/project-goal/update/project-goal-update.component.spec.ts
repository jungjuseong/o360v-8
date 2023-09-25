import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProjectGoalService } from '../service/project-goal.service';
import { IProjectGoal } from '../project-goal.model';
import { ProjectGoalFormService } from './project-goal-form.service';

import { ProjectGoalUpdateComponent } from './project-goal-update.component';

describe('ProjectGoal Management Update Component', () => {
  let comp: ProjectGoalUpdateComponent;
  let fixture: ComponentFixture<ProjectGoalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let projectGoalFormService: ProjectGoalFormService;
  let projectGoalService: ProjectGoalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProjectGoalUpdateComponent],
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
      .overrideTemplate(ProjectGoalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProjectGoalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    projectGoalFormService = TestBed.inject(ProjectGoalFormService);
    projectGoalService = TestBed.inject(ProjectGoalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const projectGoal: IProjectGoal = { id: 456 };

      activatedRoute.data = of({ projectGoal });
      comp.ngOnInit();

      expect(comp.projectGoal).toEqual(projectGoal);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProjectGoal>>();
      const projectGoal = { id: 123 };
      jest.spyOn(projectGoalFormService, 'getProjectGoal').mockReturnValue(projectGoal);
      jest.spyOn(projectGoalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectGoal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: projectGoal }));
      saveSubject.complete();

      // THEN
      expect(projectGoalFormService.getProjectGoal).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(projectGoalService.update).toHaveBeenCalledWith(expect.objectContaining(projectGoal));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProjectGoal>>();
      const projectGoal = { id: 123 };
      jest.spyOn(projectGoalFormService, 'getProjectGoal').mockReturnValue({ id: null });
      jest.spyOn(projectGoalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectGoal: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: projectGoal }));
      saveSubject.complete();

      // THEN
      expect(projectGoalFormService.getProjectGoal).toHaveBeenCalled();
      expect(projectGoalService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProjectGoal>>();
      const projectGoal = { id: 123 };
      jest.spyOn(projectGoalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectGoal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(projectGoalService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
