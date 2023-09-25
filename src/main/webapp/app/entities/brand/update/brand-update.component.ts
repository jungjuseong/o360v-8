import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IArea } from 'app/entities/area/area.model';
import { AreaService } from 'app/entities/area/service/area.service';
import { IBrand } from '../brand.model';
import { BrandService } from '../service/brand.service';
import { BrandFormService, BrandFormGroup } from './brand-form.service';

@Component({
  standalone: true,
  selector: 'jhi-brand-update',
  templateUrl: './brand-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BrandUpdateComponent implements OnInit {
  isSaving = false;
  brand: IBrand | null = null;

  areasSharedCollection: IArea[] = [];

  editForm: BrandFormGroup = this.brandFormService.createBrandFormGroup();

  constructor(
    protected brandService: BrandService,
    protected brandFormService: BrandFormService,
    protected areaService: AreaService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareArea = (o1: IArea | null, o2: IArea | null): boolean => this.areaService.compareArea(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ brand }) => {
      this.brand = brand;
      if (brand) {
        this.updateForm(brand);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const brand = this.brandFormService.getBrand(this.editForm);
    if (brand.id !== null) {
      this.subscribeToSaveResponse(this.brandService.update(brand));
    } else {
      this.subscribeToSaveResponse(this.brandService.create(brand));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBrand>>): void {
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

  protected updateForm(brand: IBrand): void {
    this.brand = brand;
    this.brandFormService.resetForm(this.editForm, brand);

    this.areasSharedCollection = this.areaService.addAreaToCollectionIfMissing<IArea>(this.areasSharedCollection, brand.area);
  }

  protected loadRelationshipsOptions(): void {
    this.areaService
      .query()
      .pipe(map((res: HttpResponse<IArea[]>) => res.body ?? []))
      .pipe(map((areas: IArea[]) => this.areaService.addAreaToCollectionIfMissing<IArea>(areas, this.brand?.area)))
      .subscribe((areas: IArea[]) => (this.areasSharedCollection = areas));
  }
}
