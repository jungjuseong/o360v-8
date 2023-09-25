import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICostCenter } from '../cost-center.model';
import { CostCenterService } from '../service/cost-center.service';
import { CostCenterFormService, CostCenterFormGroup } from './cost-center-form.service';

@Component({
  standalone: true,
  selector: 'jhi-cost-center-update',
  templateUrl: './cost-center-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CostCenterUpdateComponent implements OnInit {
  isSaving = false;
  costCenter: ICostCenter | null = null;

  editForm: CostCenterFormGroup = this.costCenterFormService.createCostCenterFormGroup();

  constructor(
    protected costCenterService: CostCenterService,
    protected costCenterFormService: CostCenterFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ costCenter }) => {
      this.costCenter = costCenter;
      if (costCenter) {
        this.updateForm(costCenter);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const costCenter = this.costCenterFormService.getCostCenter(this.editForm);
    if (costCenter.id !== null) {
      this.subscribeToSaveResponse(this.costCenterService.update(costCenter));
    } else {
      this.subscribeToSaveResponse(this.costCenterService.create(costCenter));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICostCenter>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(costCenter: ICostCenter): void {
    this.costCenter = costCenter;
    this.costCenterFormService.resetForm(this.editForm, costCenter);
  }
}
