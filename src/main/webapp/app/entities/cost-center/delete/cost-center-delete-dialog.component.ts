import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ICostCenter } from '../cost-center.model';
import { CostCenterService } from '../service/cost-center.service';

@Component({
  standalone: true,
  templateUrl: './cost-center-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CostCenterDeleteDialogComponent {
  costCenter?: ICostCenter;

  constructor(
    protected costCenterService: CostCenterService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.costCenterService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
