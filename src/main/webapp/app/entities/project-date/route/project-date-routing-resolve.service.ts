import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProjectDate } from '../project-date.model';
import { ProjectDateService } from '../service/project-date.service';

export const projectDateResolve = (route: ActivatedRouteSnapshot): Observable<null | IProjectDate> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProjectDateService)
      .find(id)
      .pipe(
        mergeMap((projectDate: HttpResponse<IProjectDate>) => {
          if (projectDate.body) {
            return of(projectDate.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default projectDateResolve;
