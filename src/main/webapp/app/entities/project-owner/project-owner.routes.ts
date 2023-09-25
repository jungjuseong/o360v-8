import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ProjectOwnerComponent } from './list/project-owner.component';
import { ProjectOwnerDetailComponent } from './detail/project-owner-detail.component';
import { ProjectOwnerUpdateComponent } from './update/project-owner-update.component';
import ProjectOwnerResolve from './route/project-owner-routing-resolve.service';

const projectOwnerRoute: Routes = [
  {
    path: '',
    component: ProjectOwnerComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProjectOwnerDetailComponent,
    resolve: {
      projectOwner: ProjectOwnerResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProjectOwnerUpdateComponent,
    resolve: {
      projectOwner: ProjectOwnerResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProjectOwnerUpdateComponent,
    resolve: {
      projectOwner: ProjectOwnerResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default projectOwnerRoute;
