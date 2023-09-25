import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAudience } from 'app/entities/audience/audience.model';
import { AudienceService } from 'app/entities/audience/service/audience.service';
import { ChannelType } from 'app/entities/enumerations/channel-type.model';
import { ChannelService } from '../service/channel.service';
import { IChannel } from '../channel.model';
import { ChannelFormService, ChannelFormGroup } from './channel-form.service';

@Component({
  standalone: true,
  selector: 'jhi-channel-update',
  templateUrl: './channel-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ChannelUpdateComponent implements OnInit {
  isSaving = false;
  channel: IChannel | null = null;
  channelTypeValues = Object.keys(ChannelType);

  audiencesSharedCollection: IAudience[] = [];

  editForm: ChannelFormGroup = this.channelFormService.createChannelFormGroup();

  constructor(
    protected channelService: ChannelService,
    protected channelFormService: ChannelFormService,
    protected audienceService: AudienceService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareAudience = (o1: IAudience | null, o2: IAudience | null): boolean => this.audienceService.compareAudience(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ channel }) => {
      this.channel = channel;
      if (channel) {
        this.updateForm(channel);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const channel = this.channelFormService.getChannel(this.editForm);
    if (channel.id !== null) {
      this.subscribeToSaveResponse(this.channelService.update(channel));
    } else {
      this.subscribeToSaveResponse(this.channelService.create(channel));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChannel>>): void {
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

  protected updateForm(channel: IChannel): void {
    this.channel = channel;
    this.channelFormService.resetForm(this.editForm, channel);

    this.audiencesSharedCollection = this.audienceService.addAudienceToCollectionIfMissing<IAudience>(
      this.audiencesSharedCollection,
      channel.audience,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.audienceService
      .query()
      .pipe(map((res: HttpResponse<IAudience[]>) => res.body ?? []))
      .pipe(
        map((audiences: IAudience[]) =>
          this.audienceService.addAudienceToCollectionIfMissing<IAudience>(audiences, this.channel?.audience),
        ),
      )
      .subscribe((audiences: IAudience[]) => (this.audiencesSharedCollection = audiences));
  }
}
