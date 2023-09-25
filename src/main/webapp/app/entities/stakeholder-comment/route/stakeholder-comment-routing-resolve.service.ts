import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStakeholderComment } from '../stakeholder-comment.model';
import { StakeholderCommentService } from '../service/stakeholder-comment.service';

export const stakeholderCommentResolve = (route: ActivatedRouteSnapshot): Observable<null | IStakeholderComment> => {
  const id = route.params['id'];
  if (id) {
    return inject(StakeholderCommentService)
      .find(id)
      .pipe(
        mergeMap((stakeholderComment: HttpResponse<IStakeholderComment>) => {
          if (stakeholderComment.body) {
            return of(stakeholderComment.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default stakeholderCommentResolve;
