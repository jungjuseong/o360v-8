import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { JiraSetUpService } from '../service/jira-set-up.service';
import { IJiraSetUp } from '../jira-set-up.model';
import { JiraSetUpFormService } from './jira-set-up-form.service';

import { JiraSetUpUpdateComponent } from './jira-set-up-update.component';

describe('JiraSetUp Management Update Component', () => {
  let comp: JiraSetUpUpdateComponent;
  let fixture: ComponentFixture<JiraSetUpUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let jiraSetUpFormService: JiraSetUpFormService;
  let jiraSetUpService: JiraSetUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), JiraSetUpUpdateComponent],
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
      .overrideTemplate(JiraSetUpUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JiraSetUpUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jiraSetUpFormService = TestBed.inject(JiraSetUpFormService);
    jiraSetUpService = TestBed.inject(JiraSetUpService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const jiraSetUp: IJiraSetUp = { id: 456 };

      activatedRoute.data = of({ jiraSetUp });
      comp.ngOnInit();

      expect(comp.jiraSetUp).toEqual(jiraSetUp);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJiraSetUp>>();
      const jiraSetUp = { id: 123 };
      jest.spyOn(jiraSetUpFormService, 'getJiraSetUp').mockReturnValue(jiraSetUp);
      jest.spyOn(jiraSetUpService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jiraSetUp });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jiraSetUp }));
      saveSubject.complete();

      // THEN
      expect(jiraSetUpFormService.getJiraSetUp).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(jiraSetUpService.update).toHaveBeenCalledWith(expect.objectContaining(jiraSetUp));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJiraSetUp>>();
      const jiraSetUp = { id: 123 };
      jest.spyOn(jiraSetUpFormService, 'getJiraSetUp').mockReturnValue({ id: null });
      jest.spyOn(jiraSetUpService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jiraSetUp: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jiraSetUp }));
      saveSubject.complete();

      // THEN
      expect(jiraSetUpFormService.getJiraSetUp).toHaveBeenCalled();
      expect(jiraSetUpService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJiraSetUp>>();
      const jiraSetUp = { id: 123 };
      jest.spyOn(jiraSetUpService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jiraSetUp });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jiraSetUpService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
