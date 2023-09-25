import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IJira } from '../jira.model';
import { JiraService } from '../service/jira.service';

@Component({
  standalone: true,
  templateUrl: './jira-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class JiraDeleteDialogComponent {
  jira?: IJira;

  constructor(
    protected jiraService: JiraService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jiraService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
