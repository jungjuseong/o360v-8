import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IProjectFile } from '../project-file.model';
import { ProjectFileService } from '../service/project-file.service';

@Component({
  standalone: true,
  templateUrl: './project-file-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ProjectFileDeleteDialogComponent {
  projectFile?: IProjectFile;

  constructor(
    protected projectFileService: ProjectFileService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.projectFileService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
