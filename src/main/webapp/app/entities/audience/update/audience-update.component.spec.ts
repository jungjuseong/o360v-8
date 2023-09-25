import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IBrand } from 'app/entities/brand/brand.model';
import { BrandService } from 'app/entities/brand/service/brand.service';
import { AudienceService } from '../service/audience.service';
import { IAudience } from '../audience.model';
import { AudienceFormService } from './audience-form.service';

import { AudienceUpdateComponent } from './audience-update.component';

describe('Audience Management Update Component', () => {
  let comp: AudienceUpdateComponent;
  let fixture: ComponentFixture<AudienceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let audienceFormService: AudienceFormService;
  let audienceService: AudienceService;
  let brandService: BrandService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), AudienceUpdateComponent],
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
      .overrideTemplate(AudienceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AudienceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    audienceFormService = TestBed.inject(AudienceFormService);
    audienceService = TestBed.inject(AudienceService);
    brandService = TestBed.inject(BrandService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Brand query and add missing value', () => {
      const audience: IAudience = { id: 456 };
      const brand: IBrand = { id: 31366 };
      audience.brand = brand;

      const brandCollection: IBrand[] = [{ id: 24424 }];
      jest.spyOn(brandService, 'query').mockReturnValue(of(new HttpResponse({ body: brandCollection })));
      const additionalBrands = [brand];
      const expectedCollection: IBrand[] = [...additionalBrands, ...brandCollection];
      jest.spyOn(brandService, 'addBrandToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ audience });
      comp.ngOnInit();

      expect(brandService.query).toHaveBeenCalled();
      expect(brandService.addBrandToCollectionIfMissing).toHaveBeenCalledWith(
        brandCollection,
        ...additionalBrands.map(expect.objectContaining),
      );
      expect(comp.brandsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const audience: IAudience = { id: 456 };
      const brand: IBrand = { id: 27259 };
      audience.brand = brand;

      activatedRoute.data = of({ audience });
      comp.ngOnInit();

      expect(comp.brandsSharedCollection).toContain(brand);
      expect(comp.audience).toEqual(audience);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAudience>>();
      const audience = { id: 123 };
      jest.spyOn(audienceFormService, 'getAudience').mockReturnValue(audience);
      jest.spyOn(audienceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ audience });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: audience }));
      saveSubject.complete();

      // THEN
      expect(audienceFormService.getAudience).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(audienceService.update).toHaveBeenCalledWith(expect.objectContaining(audience));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAudience>>();
      const audience = { id: 123 };
      jest.spyOn(audienceFormService, 'getAudience').mockReturnValue({ id: null });
      jest.spyOn(audienceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ audience: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: audience }));
      saveSubject.complete();

      // THEN
      expect(audienceFormService.getAudience).toHaveBeenCalled();
      expect(audienceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAudience>>();
      const audience = { id: 123 };
      jest.spyOn(audienceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ audience });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(audienceService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBrand', () => {
      it('Should forward to brandService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(brandService, 'compareBrand');
        comp.compareBrand(entity, entity2);
        expect(brandService.compareBrand).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
