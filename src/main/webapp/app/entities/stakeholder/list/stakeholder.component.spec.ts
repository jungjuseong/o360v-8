import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StakeholderService } from '../service/stakeholder.service';

import { StakeholderComponent } from './stakeholder.component';

describe('Stakeholder Management Component', () => {
  let comp: StakeholderComponent;
  let fixture: ComponentFixture<StakeholderComponent>;
  let service: StakeholderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'stakeholder', component: StakeholderComponent }]),
        HttpClientTestingModule,
        StakeholderComponent,
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
      .overrideTemplate(StakeholderComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StakeholderComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StakeholderService);

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
    expect(comp.stakeholders?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to stakeholderService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getStakeholderIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getStakeholderIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
