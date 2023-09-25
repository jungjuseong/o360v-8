import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CostCenterService } from '../service/cost-center.service';
import { ICostCenter } from '../cost-center.model';
import { CostCenterFormService } from './cost-center-form.service';

import { CostCenterUpdateComponent } from './cost-center-update.component';

describe('CostCenter Management Update Component', () => {
  let comp: CostCenterUpdateComponent;
  let fixture: ComponentFixture<CostCenterUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let costCenterFormService: CostCenterFormService;
  let costCenterService: CostCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), CostCenterUpdateComponent],
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
      .overrideTemplate(CostCenterUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CostCenterUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    costCenterFormService = TestBed.inject(CostCenterFormService);
    costCenterService = TestBed.inject(CostCenterService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const costCenter: ICostCenter = { id: 456 };

      activatedRoute.data = of({ costCenter });
      comp.ngOnInit();

      expect(comp.costCenter).toEqual(costCenter);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICostCenter>>();
      const costCenter = { id: 123 };
      jest.spyOn(costCenterFormService, 'getCostCenter').mockReturnValue(costCenter);
      jest.spyOn(costCenterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ costCenter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: costCenter }));
      saveSubject.complete();

      // THEN
      expect(costCenterFormService.getCostCenter).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(costCenterService.update).toHaveBeenCalledWith(expect.objectContaining(costCenter));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICostCenter>>();
      const costCenter = { id: 123 };
      jest.spyOn(costCenterFormService, 'getCostCenter').mockReturnValue({ id: null });
      jest.spyOn(costCenterService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ costCenter: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: costCenter }));
      saveSubject.complete();

      // THEN
      expect(costCenterFormService.getCostCenter).toHaveBeenCalled();
      expect(costCenterService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICostCenter>>();
      const costCenter = { id: 123 };
      jest.spyOn(costCenterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ costCenter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(costCenterService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
