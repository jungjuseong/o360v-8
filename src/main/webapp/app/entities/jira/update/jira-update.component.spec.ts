import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { JiraService } from '../service/jira.service';
import { IJira } from '../jira.model';
import { JiraFormService } from './jira-form.service';

import { JiraUpdateComponent } from './jira-update.component';

describe('Jira Management Update Component', () => {
  let comp: JiraUpdateComponent;
  let fixture: ComponentFixture<JiraUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let jiraFormService: JiraFormService;
  let jiraService: JiraService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), JiraUpdateComponent],
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
      .overrideTemplate(JiraUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JiraUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jiraFormService = TestBed.inject(JiraFormService);
    jiraService = TestBed.inject(JiraService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const jira: IJira = { id: 456 };

      activatedRoute.data = of({ jira });
      comp.ngOnInit();

      expect(comp.jira).toEqual(jira);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJira>>();
      const jira = { id: 123 };
      jest.spyOn(jiraFormService, 'getJira').mockReturnValue(jira);
      jest.spyOn(jiraService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jira });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jira }));
      saveSubject.complete();

      // THEN
      expect(jiraFormService.getJira).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(jiraService.update).toHaveBeenCalledWith(expect.objectContaining(jira));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJira>>();
      const jira = { id: 123 };
      jest.spyOn(jiraFormService, 'getJira').mockReturnValue({ id: null });
      jest.spyOn(jiraService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jira: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jira }));
      saveSubject.complete();

      // THEN
      expect(jiraFormService.getJira).toHaveBeenCalled();
      expect(jiraService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJira>>();
      const jira = { id: 123 };
      jest.spyOn(jiraService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jira });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jiraService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
