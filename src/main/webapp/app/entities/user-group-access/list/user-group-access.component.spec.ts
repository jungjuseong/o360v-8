import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserGroupAccessService } from '../service/user-group-access.service';

import { UserGroupAccessComponent } from './user-group-access.component';

describe('UserGroupAccess Management Component', () => {
  let comp: UserGroupAccessComponent;
  let fixture: ComponentFixture<UserGroupAccessComponent>;
  let service: UserGroupAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'user-group-access', component: UserGroupAccessComponent }]),
        HttpClientTestingModule,
        UserGroupAccessComponent,
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
      .overrideTemplate(UserGroupAccessComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserGroupAccessComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserGroupAccessService);

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
    expect(comp.userGroupAccesses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userGroupAccessService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserGroupAccessIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserGroupAccessIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
