import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IUserGroup } from '../user-group.model';
import { UserGroupService } from '../service/user-group.service';

@Component({
  standalone: true,
  templateUrl: './user-group-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class UserGroupDeleteDialogComponent {
  userGroup?: IUserGroup;

  constructor(
    protected userGroupService: UserGroupService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userGroupService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
