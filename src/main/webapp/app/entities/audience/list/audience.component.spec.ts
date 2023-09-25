import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AudienceService } from '../service/audience.service';

import { AudienceComponent } from './audience.component';

describe('Audience Management Component', () => {
  let comp: AudienceComponent;
  let fixture: ComponentFixture<AudienceComponent>;
  let service: AudienceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'audience', component: AudienceComponent }]),
        HttpClientTestingModule,
        AudienceComponent,
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
      .overrideTemplate(AudienceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AudienceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AudienceService);

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
    expect(comp.audiences?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to audienceService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAudienceIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAudienceIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
