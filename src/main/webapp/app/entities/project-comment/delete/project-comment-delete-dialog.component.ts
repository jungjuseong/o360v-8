import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IProjectComment } from '../project-comment.model';
import { ProjectCommentService } from '../service/project-comment.service';

@Component({
  standalone: true,
  templateUrl: './project-comment-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ProjectCommentDeleteDialogComponent {
  projectComment?: IProjectComment;

  constructor(
    protected projectCommentService: ProjectCommentService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.projectCommentService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
