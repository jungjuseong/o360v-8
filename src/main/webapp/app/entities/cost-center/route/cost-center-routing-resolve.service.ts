import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICostCenter } from '../cost-center.model';
import { CostCenterService } from '../service/cost-center.service';

export const costCenterResolve = (route: ActivatedRouteSnapshot): Observable<null | ICostCenter> => {
  const id = route.params['id'];
  if (id) {
    return inject(CostCenterService)
      .find(id)
      .pipe(
        mergeMap((costCenter: HttpResponse<ICostCenter>) => {
          if (costCenter.body) {
            return of(costCenter.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default costCenterResolve;
