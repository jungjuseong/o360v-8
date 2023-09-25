import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AccountNumberComponent } from './list/account-number.component';
import { AccountNumberDetailComponent } from './detail/account-number-detail.component';
import { AccountNumberUpdateComponent } from './update/account-number-update.component';
import AccountNumberResolve from './route/account-number-routing-resolve.service';

const accountNumberRoute: Routes = [
  {
    path: '',
    component: AccountNumberComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AccountNumberDetailComponent,
    resolve: {
      accountNumber: AccountNumberResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AccountNumberUpdateComponent,
    resolve: {
      accountNumber: AccountNumberResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AccountNumberUpdateComponent,
    resolve: {
      accountNumber: AccountNumberResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default accountNumberRoute;
