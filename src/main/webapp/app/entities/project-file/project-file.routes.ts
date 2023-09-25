import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ProjectFileComponent } from './list/project-file.component';
import { ProjectFileDetailComponent } from './detail/project-file-detail.component';
import { ProjectFileUpdateComponent } from './update/project-file-update.component';
import ProjectFileResolve from './route/project-file-routing-resolve.service';

const projectFileRoute: Routes = [
  {
    path: '',
    component: ProjectFileComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProjectFileDetailComponent,
    resolve: {
      projectFile: ProjectFileResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProjectFileUpdateComponent,
    resolve: {
      projectFile: ProjectFileResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProjectFileUpdateComponent,
    resolve: {
      projectFile: ProjectFileResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default projectFileRoute;
