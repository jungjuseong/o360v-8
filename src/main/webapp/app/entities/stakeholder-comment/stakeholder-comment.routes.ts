import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { StakeholderCommentComponent } from './list/stakeholder-comment.component';
import { StakeholderCommentDetailComponent } from './detail/stakeholder-comment-detail.component';
import { StakeholderCommentUpdateComponent } from './update/stakeholder-comment-update.component';
import StakeholderCommentResolve from './route/stakeholder-comment-routing-resolve.service';

const stakeholderCommentRoute: Routes = [
  {
    path: '',
    component: StakeholderCommentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StakeholderCommentDetailComponent,
    resolve: {
      stakeholderComment: StakeholderCommentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StakeholderCommentUpdateComponent,
    resolve: {
      stakeholderComment: StakeholderCommentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StakeholderCommentUpdateComponent,
    resolve: {
      stakeholderComment: StakeholderCommentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default stakeholderCommentRoute;
