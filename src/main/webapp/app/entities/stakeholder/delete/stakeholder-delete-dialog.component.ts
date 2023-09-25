import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IStakeholder } from '../stakeholder.model';
import { StakeholderService } from '../service/stakeholder.service';

@Component({
  standalone: true,
  templateUrl: './stakeholder-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class StakeholderDeleteDialogComponent {
  stakeholder?: IStakeholder;

  constructor(
    protected stakeholderService: StakeholderService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.stakeholderService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
