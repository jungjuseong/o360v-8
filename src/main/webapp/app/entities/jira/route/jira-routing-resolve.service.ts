import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJira } from '../jira.model';
import { JiraService } from '../service/jira.service';

export const jiraResolve = (route: ActivatedRouteSnapshot): Observable<null | IJira> => {
  const id = route.params['id'];
  if (id) {
    return inject(JiraService)
      .find(id)
      .pipe(
        mergeMap((jira: HttpResponse<IJira>) => {
          if (jira.body) {
            return of(jira.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default jiraResolve;
