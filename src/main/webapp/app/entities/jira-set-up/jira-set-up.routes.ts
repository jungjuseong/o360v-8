import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { JiraSetUpComponent } from './list/jira-set-up.component';
import { JiraSetUpDetailComponent } from './detail/jira-set-up-detail.component';
import { JiraSetUpUpdateComponent } from './update/jira-set-up-update.component';
import JiraSetUpResolve from './route/jira-set-up-routing-resolve.service';

const jiraSetUpRoute: Routes = [
  {
    path: '',
    component: JiraSetUpComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: JiraSetUpDetailComponent,
    resolve: {
      jiraSetUp: JiraSetUpResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: JiraSetUpUpdateComponent,
    resolve: {
      jiraSetUp: JiraSetUpResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: JiraSetUpUpdateComponent,
    resolve: {
      jiraSetUp: JiraSetUpResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default jiraSetUpRoute;
