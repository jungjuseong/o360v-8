import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJiraSetUp } from '../jira-set-up.model';
import { JiraSetUpService } from '../service/jira-set-up.service';

export const jiraSetUpResolve = (route: ActivatedRouteSnapshot): Observable<null | IJiraSetUp> => {
  const id = route.params['id'];
  if (id) {
    return inject(JiraSetUpService)
      .find(id)
      .pipe(
        mergeMap((jiraSetUp: HttpResponse<IJiraSetUp>) => {
          if (jiraSetUp.body) {
            return of(jiraSetUp.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default jiraSetUpResolve;
