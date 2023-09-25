import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAudience } from '../audience.model';
import { AudienceService } from '../service/audience.service';

@Component({
  standalone: true,
  templateUrl: './audience-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AudienceDeleteDialogComponent {
  audience?: IAudience;

  constructor(
    protected audienceService: AudienceService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.audienceService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
