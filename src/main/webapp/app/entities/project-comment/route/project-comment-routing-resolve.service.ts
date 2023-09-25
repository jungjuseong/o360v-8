import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProjectComment } from '../project-comment.model';
import { ProjectCommentService } from '../service/project-comment.service';

export const projectCommentResolve = (route: ActivatedRouteSnapshot): Observable<null | IProjectComment> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProjectCommentService)
      .find(id)
      .pipe(
        mergeMap((projectComment: HttpResponse<IProjectComment>) => {
          if (projectComment.body) {
            return of(projectComment.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default projectCommentResolve;
