import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAccountNumber } from '../account-number.model';
import { AccountNumberService } from '../service/account-number.service';
import { AccountNumberFormService, AccountNumberFormGroup } from './account-number-form.service';

@Component({
  standalone: true,
  selector: 'jhi-account-number-update',
  templateUrl: './account-number-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AccountNumberUpdateComponent implements OnInit {
  isSaving = false;
  accountNumber: IAccountNumber | null = null;

  editForm: AccountNumberFormGroup = this.accountNumberFormService.createAccountNumberFormGroup();

  constructor(
    protected accountNumberService: AccountNumberService,
    protected accountNumberFormService: AccountNumberFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountNumber }) => {
      this.accountNumber = accountNumber;
      if (accountNumber) {
        this.updateForm(accountNumber);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const accountNumber = this.accountNumberFormService.getAccountNumber(this.editForm);
    if (accountNumber.id !== null) {
      this.subscribeToSaveResponse(this.accountNumberService.update(accountNumber));
    } else {
      this.subscribeToSaveResponse(this.accountNumberService.create(accountNumber));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAccountNumber>>): void {
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

  protected updateForm(accountNumber: IAccountNumber): void {
    this.accountNumber = accountNumber;
    this.accountNumberFormService.resetForm(this.editForm, accountNumber);
  }
}
