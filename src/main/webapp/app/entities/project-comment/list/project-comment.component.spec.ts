import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProjectCommentService } from '../service/project-comment.service';

import { ProjectCommentComponent } from './project-comment.component';

describe('ProjectComment Management Component', () => {
  let comp: ProjectCommentComponent;
  let fixture: ComponentFixture<ProjectCommentComponent>;
  let service: ProjectCommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'project-comment', component: ProjectCommentComponent }]),
        HttpClientTestingModule,
        ProjectCommentComponent,
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
      .overrideTemplate(ProjectCommentComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProjectCommentComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProjectCommentService);

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
    expect(comp.projectComments?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to projectCommentService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getProjectCommentIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getProjectCommentIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
