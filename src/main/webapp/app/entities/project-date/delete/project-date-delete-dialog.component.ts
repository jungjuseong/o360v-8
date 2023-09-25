import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IProjectDate } from '../project-date.model';
import { ProjectDateService } from '../service/project-date.service';

@Component({
  standalone: true,
  templateUrl: './project-date-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ProjectDateDeleteDialogComponent {
  projectDate?: IProjectDate;

  constructor(
    protected projectDateService: ProjectDateService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.projectDateService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
