import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IUserGroupAccess } from '../user-group-access.model';
import { UserGroupAccessService } from '../service/user-group-access.service';

@Component({
  standalone: true,
  templateUrl: './user-group-access-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class UserGroupAccessDeleteDialogComponent {
  userGroupAccess?: IUserGroupAccess;

  constructor(
    protected userGroupAccessService: UserGroupAccessService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userGroupAccessService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
