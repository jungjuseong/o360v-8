import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { JiraComponent } from './list/jira.component';
import { JiraDetailComponent } from './detail/jira-detail.component';
import { JiraUpdateComponent } from './update/jira-update.component';
import JiraResolve from './route/jira-routing-resolve.service';

const jiraRoute: Routes = [
  {
    path: '',
    component: JiraComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: JiraDetailComponent,
    resolve: {
      jira: JiraResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: JiraUpdateComponent,
    resolve: {
      jira: JiraResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: JiraUpdateComponent,
    resolve: {
      jira: JiraResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default jiraRoute;
