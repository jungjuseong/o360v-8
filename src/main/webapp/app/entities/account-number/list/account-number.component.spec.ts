import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AccountNumberService } from '../service/account-number.service';

import { AccountNumberComponent } from './account-number.component';

describe('AccountNumber Management Component', () => {
  let comp: AccountNumberComponent;
  let fixture: ComponentFixture<AccountNumberComponent>;
  let service: AccountNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'account-number', component: AccountNumberComponent }]),
        HttpClientTestingModule,
        AccountNumberComponent,
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
      .overrideTemplate(AccountNumberComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AccountNumberComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AccountNumberService);

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
    expect(comp.accountNumbers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to accountNumberService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAccountNumberIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAccountNumberIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
