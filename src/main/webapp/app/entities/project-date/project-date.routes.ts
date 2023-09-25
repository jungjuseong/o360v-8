import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ProjectDateComponent } from './list/project-date.component';
import { ProjectDateDetailComponent } from './detail/project-date-detail.component';
import { ProjectDateUpdateComponent } from './update/project-date-update.component';
import ProjectDateResolve from './route/project-date-routing-resolve.service';

const projectDateRoute: Routes = [
  {
    path: '',
    component: ProjectDateComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProjectDateDetailComponent,
    resolve: {
      projectDate: ProjectDateResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProjectDateUpdateComponent,
    resolve: {
      projectDate: ProjectDateResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProjectDateUpdateComponent,
    resolve: {
      projectDate: ProjectDateResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default projectDateRoute;
