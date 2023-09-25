import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IBrand } from 'app/entities/brand/brand.model';
import { BrandService } from 'app/entities/brand/service/brand.service';
import { IAudience } from '../audience.model';
import { AudienceService } from '../service/audience.service';
import { AudienceFormService, AudienceFormGroup } from './audience-form.service';

@Component({
  standalone: true,
  selector: 'jhi-audience-update',
  templateUrl: './audience-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AudienceUpdateComponent implements OnInit {
  isSaving = false;
  audience: IAudience | null = null;

  brandsSharedCollection: IBrand[] = [];

  editForm: AudienceFormGroup = this.audienceFormService.createAudienceFormGroup();

  constructor(
    protected audienceService: AudienceService,
    protected audienceFormService: AudienceFormService,
    protected brandService: BrandService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareBrand = (o1: IBrand | null, o2: IBrand | null): boolean => this.brandService.compareBrand(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ audience }) => {
      this.audience = audience;
      if (audience) {
        this.updateForm(audience);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const audience = this.audienceFormService.getAudience(this.editForm);
    if (audience.id !== null) {
      this.subscribeToSaveResponse(this.audienceService.update(audience));
    } else {
      this.subscribeToSaveResponse(this.audienceService.create(audience));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAudience>>): void {
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

  protected updateForm(audience: IAudience): void {
    this.audience = audience;
    this.audienceFormService.resetForm(this.editForm, audience);

    this.brandsSharedCollection = this.brandService.addBrandToCollectionIfMissing<IBrand>(this.brandsSharedCollection, audience.brand);
  }

  protected loadRelationshipsOptions(): void {
    this.brandService
      .query()
      .pipe(map((res: HttpResponse<IBrand[]>) => res.body ?? []))
      .pipe(map((brands: IBrand[]) => this.brandService.addBrandToCollectionIfMissing<IBrand>(brands, this.audience?.brand)))
      .subscribe((brands: IBrand[]) => (this.brandsSharedCollection = brands));
  }
}
