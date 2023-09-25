import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { StakeholderComponent } from './list/stakeholder.component';
import { StakeholderDetailComponent } from './detail/stakeholder-detail.component';
import { StakeholderUpdateComponent } from './update/stakeholder-update.component';
import StakeholderResolve from './route/stakeholder-routing-resolve.service';

const stakeholderRoute: Routes = [
  {
    path: '',
    component: StakeholderComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StakeholderDetailComponent,
    resolve: {
      stakeholder: StakeholderResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StakeholderUpdateComponent,
    resolve: {
      stakeholder: StakeholderResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StakeholderUpdateComponent,
    resolve: {
      stakeholder: StakeholderResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default stakeholderRoute;
