import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserGroupAccess } from '../user-group-access.model';
import { UserGroupAccessService } from '../service/user-group-access.service';

export const userGroupAccessResolve = (route: ActivatedRouteSnapshot): Observable<null | IUserGroupAccess> => {
  const id = route.params['id'];
  if (id) {
    return inject(UserGroupAccessService)
      .find(id)
      .pipe(
        mergeMap((userGroupAccess: HttpResponse<IUserGroupAccess>) => {
          if (userGroupAccess.body) {
            return of(userGroupAccess.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default userGroupAccessResolve;
