import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { ProjectGoalComponent } from './list/project-goal.component';
import { ProjectGoalDetailComponent } from './detail/project-goal-detail.component';
import { ProjectGoalUpdateComponent } from './update/project-goal-update.component';
import ProjectGoalResolve from './route/project-goal-routing-resolve.service';

const projectGoalRoute: Routes = [
  {
    path: '',
    component: ProjectGoalComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProjectGoalDetailComponent,
    resolve: {
      projectGoal: ProjectGoalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProjectGoalUpdateComponent,
    resolve: {
      projectGoal: ProjectGoalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProjectGoalUpdateComponent,
    resolve: {
      projectGoal: ProjectGoalResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default projectGoalRoute;
