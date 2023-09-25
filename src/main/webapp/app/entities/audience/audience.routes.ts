import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AudienceComponent } from './list/audience.component';
import { AudienceDetailComponent } from './detail/audience-detail.component';
import { AudienceUpdateComponent } from './update/audience-update.component';
import AudienceResolve from './route/audience-routing-resolve.service';

const audienceRoute: Routes = [
  {
    path: '',
    component: AudienceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AudienceDetailComponent,
    resolve: {
      audience: AudienceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AudienceUpdateComponent,
    resolve: {
      audience: AudienceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AudienceUpdateComponent,
    resolve: {
      audience: AudienceResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default audienceRoute;
