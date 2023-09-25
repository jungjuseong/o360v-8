import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AccountNumberService } from '../service/account-number.service';
import { IAccountNumber } from '../account-number.model';
import { AccountNumberFormService } from './account-number-form.service';

import { AccountNumberUpdateComponent } from './account-number-update.component';

describe('AccountNumber Management Update Component', () => {
  let comp: AccountNumberUpdateComponent;
  let fixture: ComponentFixture<AccountNumberUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let accountNumberFormService: AccountNumberFormService;
  let accountNumberService: AccountNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), AccountNumberUpdateComponent],
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
      .overrideTemplate(AccountNumberUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AccountNumberUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    accountNumberFormService = TestBed.inject(AccountNumberFormService);
    accountNumberService = TestBed.inject(AccountNumberService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const accountNumber: IAccountNumber = { id: 456 };

      activatedRoute.data = of({ accountNumber });
      comp.ngOnInit();

      expect(comp.accountNumber).toEqual(accountNumber);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAccountNumber>>();
      const accountNumber = { id: 123 };
      jest.spyOn(accountNumberFormService, 'getAccountNumber').mockReturnValue(accountNumber);
      jest.spyOn(accountNumberService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountNumber });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accountNumber }));
      saveSubject.complete();

      // THEN
      expect(accountNumberFormService.getAccountNumber).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(accountNumberService.update).toHaveBeenCalledWith(expect.objectContaining(accountNumber));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAccountNumber>>();
      const accountNumber = { id: 123 };
      jest.spyOn(accountNumberFormService, 'getAccountNumber').mockReturnValue({ id: null });
      jest.spyOn(accountNumberService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountNumber: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accountNumber }));
      saveSubject.complete();

      // THEN
      expect(accountNumberFormService.getAccountNumber).toHaveBeenCalled();
      expect(accountNumberService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAccountNumber>>();
      const accountNumber = { id: 123 };
      jest.spyOn(accountNumberService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountNumber });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(accountNumberService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
