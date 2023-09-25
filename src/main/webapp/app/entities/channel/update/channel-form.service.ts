import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IChannel, NewChannel } from '../channel.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IChannel for edit and NewChannelFormGroupInput for create.
 */
type ChannelFormGroupInput = IChannel | PartialWithRequiredKeyOf<NewChannel>;

type ChannelFormDefaults = Pick<NewChannel, 'id'>;

type ChannelFormGroupContent = {
  id: FormControl<IChannel['id'] | NewChannel['id']>;
  channelType: FormControl<IChannel['channelType']>;
  audience: FormControl<IChannel['audience']>;
};

export type ChannelFormGroup = FormGroup<ChannelFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ChannelFormService {
  createChannelFormGroup(channel: ChannelFormGroupInput = { id: null }): ChannelFormGroup {
    const channelRawValue = {
      ...this.getFormDefaults(),
      ...channel,
    };
    return new FormGroup<ChannelFormGroupContent>({
      id: new FormControl(
        { value: channelRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      channelType: new FormControl(channelRawValue.channelType),
      audience: new FormControl(channelRawValue.audience, {
        validators: [Validators.required],
      }),
    });
  }

  getChannel(form: ChannelFormGroup): IChannel | NewChannel {
    return form.getRawValue() as IChannel | NewChannel;
  }

  resetForm(form: ChannelFormGroup, channel: ChannelFormGroupInput): void {
    const channelRawValue = { ...this.getFormDefaults(), ...channel };
    form.reset(
      {
        ...channelRawValue,
        id: { value: channelRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ChannelFormDefaults {
    return {
      id: null,
    };
  }
}
