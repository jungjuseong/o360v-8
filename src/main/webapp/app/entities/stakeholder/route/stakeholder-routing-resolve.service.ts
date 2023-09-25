import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStakeholder } from '../stakeholder.model';
import { StakeholderService } from '../service/stakeholder.service';

export const stakeholderResolve = (route: ActivatedRouteSnapshot): Observable<null | IStakeholder> => {
  const id = route.params['id'];
  if (id) {
    return inject(StakeholderService)
      .find(id)
      .pipe(
        mergeMap((stakeholder: HttpResponse<IStakeholder>) => {
          if (stakeholder.body) {
            return of(stakeholder.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default stakeholderResolve;
