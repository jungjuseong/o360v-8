import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProjectGoal } from '../project-goal.model';
import { ProjectGoalService } from '../service/project-goal.service';

export const projectGoalResolve = (route: ActivatedRouteSnapshot): Observable<null | IProjectGoal> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProjectGoalService)
      .find(id)
      .pipe(
        mergeMap((projectGoal: HttpResponse<IProjectGoal>) => {
          if (projectGoal.body) {
            return of(projectGoal.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default projectGoalResolve;
