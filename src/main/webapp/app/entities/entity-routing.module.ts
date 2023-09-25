import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'country',
        data: { pageTitle: 'o360VApp.country.home.title' },
        loadChildren: () => import('./country/country.routes'),
      },
      {
        path: 'project',
        data: { pageTitle: 'o360VApp.project.home.title' },
        loadChildren: () => import('./project/project.routes'),
      },
      {
        path: 'jira-set-up',
        data: { pageTitle: 'o360VApp.jiraSetUp.home.title' },
        loadChildren: () => import('./jira-set-up/jira-set-up.routes'),
      },
      {
        path: 'jira',
        data: { pageTitle: 'o360VApp.jira.home.title' },
        loadChildren: () => import('./jira/jira.routes'),
      },
      {
        path: 'cost-center',
        data: { pageTitle: 'o360VApp.costCenter.home.title' },
        loadChildren: () => import('./cost-center/cost-center.routes'),
      },
      {
        path: 'account-number',
        data: { pageTitle: 'o360VApp.accountNumber.home.title' },
        loadChildren: () => import('./account-number/account-number.routes'),
      },
      {
        path: 'project-owner',
        data: { pageTitle: 'o360VApp.projectOwner.home.title' },
        loadChildren: () => import('./project-owner/project-owner.routes'),
      },
      {
        path: 'project-comment',
        data: { pageTitle: 'o360VApp.projectComment.home.title' },
        loadChildren: () => import('./project-comment/project-comment.routes'),
      },
      {
        path: 'project-file',
        data: { pageTitle: 'o360VApp.projectFile.home.title' },
        loadChildren: () => import('./project-file/project-file.routes'),
      },
      {
        path: 'project-date',
        data: { pageTitle: 'o360VApp.projectDate.home.title' },
        loadChildren: () => import('./project-date/project-date.routes'),
      },
      {
        path: 'project-goal',
        data: { pageTitle: 'o360VApp.projectGoal.home.title' },
        loadChildren: () => import('./project-goal/project-goal.routes'),
      },
      {
        path: 'stakeholder',
        data: { pageTitle: 'o360VApp.stakeholder.home.title' },
        loadChildren: () => import('./stakeholder/stakeholder.routes'),
      },
      {
        path: 'stakeholder-comment',
        data: { pageTitle: 'o360VApp.stakeholderComment.home.title' },
        loadChildren: () => import('./stakeholder-comment/stakeholder-comment.routes'),
      },
      {
        path: 'user-group',
        data: { pageTitle: 'o360VApp.userGroup.home.title' },
        loadChildren: () => import('./user-group/user-group.routes'),
      },
      {
        path: 'user-group-access',
        data: { pageTitle: 'o360VApp.userGroupAccess.home.title' },
        loadChildren: () => import('./user-group-access/user-group-access.routes'),
      },
      {
        path: 'company',
        data: { pageTitle: 'o360VApp.company.home.title' },
        loadChildren: () => import('./company/company.routes'),
      },
      {
        path: 'area',
        data: { pageTitle: 'o360VApp.area.home.title' },
        loadChildren: () => import('./area/area.routes'),
      },
      {
        path: 'brand',
        data: { pageTitle: 'o360VApp.brand.home.title' },
        loadChildren: () => import('./brand/brand.routes'),
      },
      {
        path: 'audience',
        data: { pageTitle: 'o360VApp.audience.home.title' },
        loadChildren: () => import('./audience/audience.routes'),
      },
      {
        path: 'channel',
        data: { pageTitle: 'o360VApp.channel.home.title' },
        loadChildren: () => import('./channel/channel.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
