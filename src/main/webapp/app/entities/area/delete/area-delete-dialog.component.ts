import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IArea } from '../area.model';
import { AreaService } from '../service/area.service';

@Component({
  standalone: true,
  templateUrl: './area-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AreaDeleteDialogComponent {
  area?: IArea;

  constructor(
    protected areaService: AreaService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.areaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
