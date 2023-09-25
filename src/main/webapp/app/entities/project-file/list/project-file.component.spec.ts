import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProjectFileService } from '../service/project-file.service';

import { ProjectFileComponent } from './project-file.component';

describe('ProjectFile Management Component', () => {
  let comp: ProjectFileComponent;
  let fixture: ComponentFixture<ProjectFileComponent>;
  let service: ProjectFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'project-file', component: ProjectFileComponent }]),
        HttpClientTestingModule,
        ProjectFileComponent,
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
      .overrideTemplate(ProjectFileComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProjectFileComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProjectFileService);

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
    expect(comp.projectFiles?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to projectFileService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getProjectFileIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getProjectFileIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
