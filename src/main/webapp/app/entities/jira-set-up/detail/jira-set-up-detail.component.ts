import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IJiraSetUp } from '../jira-set-up.model';

@Component({
  standalone: true,
  selector: 'jhi-jira-set-up-detail',
  templateUrl: './jira-set-up-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class JiraSetUpDetailComponent {
  @Input() jiraSetUp: IJiraSetUp | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
