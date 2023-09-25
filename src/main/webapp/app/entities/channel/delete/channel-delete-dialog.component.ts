import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IChannel } from '../channel.model';
import { ChannelService } from '../service/channel.service';

@Component({
  standalone: true,
  templateUrl: './channel-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ChannelDeleteDialogComponent {
  channel?: IChannel;

  constructor(
    protected channelService: ChannelService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.channelService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
