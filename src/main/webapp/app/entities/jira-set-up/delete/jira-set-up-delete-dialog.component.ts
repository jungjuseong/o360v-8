import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IJiraSetUp } from '../jira-set-up.model';
import { JiraSetUpService } from '../service/jira-set-up.service';

@Component({
  standalone: true,
  templateUrl: './jira-set-up-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class JiraSetUpDeleteDialogComponent {
  jiraSetUp?: IJiraSetUp;

  constructor(
    protected jiraSetUpService: JiraSetUpService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jiraSetUpService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
