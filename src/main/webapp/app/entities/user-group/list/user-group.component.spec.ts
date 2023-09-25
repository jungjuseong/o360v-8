import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserGroupService } from '../service/user-group.service';

import { UserGroupComponent } from './user-group.component';

describe('UserGroup Management Component', () => {
  let comp: UserGroupComponent;
  let fixture: ComponentFixture<UserGroupComponent>;
  let service: UserGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'user-group', component: UserGroupComponent }]),
        HttpClientTestingModule,
        UserGroupComponent,
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
      .overrideTemplate(UserGroupComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserGroupComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserGroupService);

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
    expect(comp.userGroups?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userGroupService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserGroupIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserGroupIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
