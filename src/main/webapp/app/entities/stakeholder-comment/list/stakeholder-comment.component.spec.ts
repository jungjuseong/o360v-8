import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StakeholderCommentService } from '../service/stakeholder-comment.service';

import { StakeholderCommentComponent } from './stakeholder-comment.component';

describe('StakeholderComment Management Component', () => {
  let comp: StakeholderCommentComponent;
  let fixture: ComponentFixture<StakeholderCommentComponent>;
  let service: StakeholderCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'stakeholder-comment', component: StakeholderCommentComponent }]),
        HttpClientTestingModule,
        StakeholderCommentComponent,
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
      .overrideTemplate(StakeholderCommentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StakeholderCommentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StakeholderCommentService);

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
    expect(comp.stakeholderComments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to stakeholderCommentService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getStakeholderCommentIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getStakeholderCommentIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
