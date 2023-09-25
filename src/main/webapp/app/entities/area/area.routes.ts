import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AreaComponent } from './list/area.component';
import { AreaDetailComponent } from './detail/area-detail.component';
import { AreaUpdateComponent } from './update/area-update.component';
import AreaResolve from './route/area-routing-resolve.service';

const areaRoute: Routes = [
  {
    path: '',
    component: AreaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AreaDetailComponent,
    resolve: {
      area: AreaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AreaUpdateComponent,
    resolve: {
      area: AreaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AreaUpdateComponent,
    resolve: {
      area: AreaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default areaRoute;
