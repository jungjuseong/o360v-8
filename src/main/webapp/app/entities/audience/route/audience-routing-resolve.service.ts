import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAudience } from '../audience.model';
import { AudienceService } from '../service/audience.service';

export const audienceResolve = (route: ActivatedRouteSnapshot): Observable<null | IAudience> => {
  const id = route.params['id'];
  if (id) {
    return inject(AudienceService)
      .find(id)
      .pipe(
        mergeMap((audience: HttpResponse<IAudience>) => {
          if (audience.body) {
            return of(audience.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default audienceResolve;
