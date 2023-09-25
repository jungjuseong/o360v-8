import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IStakeholderComment } from '../stakeholder-comment.model';
import { StakeholderCommentService } from '../service/stakeholder-comment.service';

@Component({
  standalone: true,
  templateUrl: './stakeholder-comment-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class StakeholderCommentDeleteDialogComponent {
  stakeholderComment?: IStakeholderComment;

  constructor(
    protected stakeholderCommentService: StakeholderCommentService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.stakeholderCommentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
