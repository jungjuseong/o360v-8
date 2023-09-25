import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { UserGroupAccessComponent } from './list/user-group-access.component';
import { UserGroupAccessDetailComponent } from './detail/user-group-access-detail.component';
import { UserGroupAccessUpdateComponent } from './update/user-group-access-update.component';
import UserGroupAccessResolve from './route/user-group-access-routing-resolve.service';

const userGroupAccessRoute: Routes = [
  {
    path: '',
    component: UserGroupAccessComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserGroupAccessDetailComponent,
    resolve: {
      userGroupAccess: UserGroupAccessResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserGroupAccessUpdateComponent,
    resolve: {
      userGroupAccess: UserGroupAccessResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserGroupAccessUpdateComponent,
    resolve: {
      userGroupAccess: UserGroupAccessResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default userGroupAccessRoute;
