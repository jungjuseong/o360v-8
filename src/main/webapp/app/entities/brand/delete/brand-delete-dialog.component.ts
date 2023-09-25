import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IBrand } from '../brand.model';
import { BrandService } from '../service/brand.service';

@Component({
  standalone: true,
  templateUrl: './brand-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BrandDeleteDialogComponent {
  brand?: IBrand;

  constructor(
    protected brandService: BrandService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.brandService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
