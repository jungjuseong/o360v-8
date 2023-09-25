import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ProjectCommentComponent } from './list/project-comment.component';
import { ProjectCommentDetailComponent } from './detail/project-comment-detail.component';
import { ProjectCommentUpdateComponent } from './update/project-comment-update.component';
import ProjectCommentResolve from './route/project-comment-routing-resolve.service';

const projectCommentRoute: Routes = [
  {
    path: '',
    component: ProjectCommentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProjectCommentDetailComponent,
    resolve: {
      projectComment: ProjectCommentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProjectCommentUpdateComponent,
    resolve: {
      projectComment: ProjectCommentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProjectCommentUpdateComponent,
    resolve: {
      projectComment: ProjectCommentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default projectCommentRoute;
