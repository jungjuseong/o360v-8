import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProjectGoalService } from '../service/project-goal.service';

import { ProjectGoalComponent } from './project-goal.component';

describe('ProjectGoal Management Component', () => {
  let comp: ProjectGoalComponent;
  let fixture: ComponentFixture<ProjectGoalComponent>;
  let service: ProjectGoalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'project-goal', component: ProjectGoalComponent }]),
        HttpClientTestingModule,
        ProjectGoalComponent,
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
      .overrideTemplate(ProjectGoalComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProjectGoalComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ProjectGoalService);

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
    expect(comp.projectGoals?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to projectGoalService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getProjectGoalIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getProjectGoalIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
