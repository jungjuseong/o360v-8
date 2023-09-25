import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProjectOwnerService } from '../service/project-owner.service';

import { ProjectOwnerComponent } from './project-owner.component';

describe('ProjectOwner Management Component', () => {
  let comp: ProjectOwnerComponent;
  let fixture: ComponentFixture<ProjectOwnerComponent>;
  let service: ProjectOwnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'project-owner', component: ProjectOwnerComponent }]),
        HttpClientTestingModule,
        ProjectOwnerComponent,
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
      .overrideTemplate(ProjectOwnerComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProjectOwnerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProjectOwnerService);

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
    expect(comp.projectOwners?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to projectOwnerService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getProjectOwnerIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getProjectOwnerIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
