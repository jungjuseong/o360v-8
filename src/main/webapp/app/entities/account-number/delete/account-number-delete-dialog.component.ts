import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IAccountNumber } from '../account-number.model';
import { AccountNumberService } from '../service/account-number.service';

@Component({
  standalone: true,
  templateUrl: './account-number-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class AccountNumberDeleteDialogComponent {
  accountNumber?: IAccountNumber;

  constructor(
    protected accountNumberService: AccountNumberService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.accountNumberService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
