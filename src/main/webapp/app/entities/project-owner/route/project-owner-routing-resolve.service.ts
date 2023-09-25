import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProjectOwner } from '../project-owner.model';
import { ProjectOwnerService } from '../service/project-owner.service';

export const projectOwnerResolve = (route: ActivatedRouteSnapshot): Observable<null | IProjectOwner> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProjectOwnerService)
      .find(id)
      .pipe(
        mergeMap((projectOwner: HttpResponse<IProjectOwner>) => {
          if (projectOwner.body) {
            return of(projectOwner.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default projectOwnerResolve;
