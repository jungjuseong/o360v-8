import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IArea } from '../area.model';
import { AreaService } from '../service/area.service';
import { AreaFormService, AreaFormGroup } from './area-form.service';

@Component({
  standalone: true,
  selector: 'jhi-area-update',
  templateUrl: './area-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AreaUpdateComponent implements OnInit {
  isSaving = false;
  area: IArea | null = null;

  editForm: AreaFormGroup = this.areaFormService.createAreaFormGroup();

  constructor(
    protected areaService: AreaService,
    protected areaFormService: AreaFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ area }) => {
      this.area = area;
      if (area) {
        this.updateForm(area);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const area = this.areaFormService.getArea(this.editForm);
    if (area.id !== null) {
      this.subscribeToSaveResponse(this.areaService.update(area));
    } else {
      this.subscribeToSaveResponse(this.areaService.create(area));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IArea>>): void {
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

  protected updateForm(area: IArea): void {
    this.area = area;
    this.areaFormService.resetForm(this.editForm, area);
  }
}
