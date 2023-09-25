import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CostCenterComponent } from './list/cost-center.component';
import { CostCenterDetailComponent } from './detail/cost-center-detail.component';
import { CostCenterUpdateComponent } from './update/cost-center-update.component';
import CostCenterResolve from './route/cost-center-routing-resolve.service';

const costCenterRoute: Routes = [
  {
    path: '',
    component: CostCenterComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CostCenterDetailComponent,
    resolve: {
      costCenter: CostCenterResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CostCenterUpdateComponent,
    resolve: {
      costCenter: CostCenterResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CostCenterUpdateComponent,
    resolve: {
      costCenter: CostCenterResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default costCenterRoute;
