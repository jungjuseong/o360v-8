import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProjectFile } from '../project-file.model';
import { ProjectFileService } from '../service/project-file.service';

export const projectFileResolve = (route: ActivatedRouteSnapshot): Observable<null | IProjectFile> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProjectFileService)
      .find(id)
      .pipe(
        mergeMap((projectFile: HttpResponse<IProjectFile>) => {
          if (projectFile.body) {
            return of(projectFile.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default projectFileResolve;
