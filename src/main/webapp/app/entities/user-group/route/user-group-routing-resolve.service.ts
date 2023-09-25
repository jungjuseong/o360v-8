import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserGroup } from '../user-group.model';
import { UserGroupService } from '../service/user-group.service';

export const userGroupResolve = (route: ActivatedRouteSnapshot): Observable<null | IUserGroup> => {
  const id = route.params['id'];
  if (id) {
    return inject(UserGroupService)
      .find(id)
      .pipe(
        mergeMap((userGroup: HttpResponse<IUserGroup>) => {
          if (userGroup.body) {
            return of(userGroup.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default userGroupResolve;
