import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IArea } from '../area.model';
import { AreaService } from '../service/area.service';

export const areaResolve = (route: ActivatedRouteSnapshot): Observable<null | IArea> => {
  const id = route.params['id'];
  if (id) {
    return inject(AreaService)
      .find(id)
      .pipe(
        mergeMap((area: HttpResponse<IArea>) => {
          if (area.body) {
            return of(area.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default areaResolve;
