import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { UserGroupComponent } from './list/user-group.component';
import { UserGroupDetailComponent } from './detail/user-group-detail.component';
import { UserGroupUpdateComponent } from './update/user-group-update.component';
import UserGroupResolve from './route/user-group-routing-resolve.service';

const userGroupRoute: Routes = [
  {
    path: '',
    component: UserGroupComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserGroupDetailComponent,
    resolve: {
      userGroup: UserGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserGroupUpdateComponent,
    resolve: {
      userGroup: UserGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserGroupUpdateComponent,
    resolve: {
      userGroup: UserGroupResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default userGroupRoute;
