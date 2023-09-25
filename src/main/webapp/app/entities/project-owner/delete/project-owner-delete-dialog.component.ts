import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IProjectOwner } from '../project-owner.model';
import { ProjectOwnerService } from '../service/project-owner.service';

@Component({
  standalone: true,
  templateUrl: './project-owner-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ProjectOwnerDeleteDialogComponent {
  projectOwner?: IProjectOwner;

  constructor(
    protected projectOwnerService: ProjectOwnerService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.projectOwnerService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
