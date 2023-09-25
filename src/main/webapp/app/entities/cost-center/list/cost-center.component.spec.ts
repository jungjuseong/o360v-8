import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CostCenterService } from '../service/cost-center.service';

import { CostCenterComponent } from './cost-center.component';

describe('CostCenter Management Component', () => {
  let comp: CostCenterComponent;
  let fixture: ComponentFixture<CostCenterComponent>;
  let service: CostCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'cost-center', component: CostCenterComponent }]),
        HttpClientTestingModule,
        CostCenterComponent,
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(CostCenterComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CostCenterComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CostCenterService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.costCenters?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to costCenterService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCostCenterIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCostCenterIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
