import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAccountNumber } from '../account-number.model';
import { AccountNumberService } from '../service/account-number.service';

export const accountNumberResolve = (route: ActivatedRouteSnapshot): Observable<null | IAccountNumber> => {
  const id = route.params['id'];
  if (id) {
    return inject(AccountNumberService)
      .find(id)
      .pipe(
        mergeMap((accountNumber: HttpResponse<IAccountNumber>) => {
          if (accountNumber.body) {
            return of(accountNumber.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default accountNumberResolve;
