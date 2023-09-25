import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { JiraSetUpService } from '../service/jira-set-up.service';

import { JiraSetUpComponent } from './jira-set-up.component';

describe('JiraSetUp Management Component', () => {
  let comp: JiraSetUpComponent;
  let fixture: ComponentFixture<JiraSetUpComponent>;
  let service: JiraSetUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'jira-set-up', component: JiraSetUpComponent }]),
        HttpClientTestingModule,
        JiraSetUpComponent,
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
      .overrideTemplate(JiraSetUpComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JiraSetUpComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(JiraSetUpService);

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
    expect(comp.jiraSetUps?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to jiraSetUpService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getJiraSetUpIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getJiraSetUpIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
