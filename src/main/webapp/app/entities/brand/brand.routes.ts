import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { BrandComponent } from './list/brand.component';
import { BrandDetailComponent } from './detail/brand-detail.component';
import { BrandUpdateComponent } from './update/brand-update.component';
import BrandResolve from './route/brand-routing-resolve.service';

const brandRoute: Routes = [
  {
    path: '',
    component: BrandComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BrandDetailComponent,
    resolve: {
      brand: BrandResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BrandUpdateComponent,
    resolve: {
      brand: BrandResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BrandUpdateComponent,
    resolve: {
      brand: BrandResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default brandRoute;
