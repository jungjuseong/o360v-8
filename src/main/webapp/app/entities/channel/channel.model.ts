import { IAudience } from 'app/entities/audience/audience.model';
import { ChannelType } from 'app/entities/enumerations/channel-type.model';

export interface IChannel {
  id: number;
  channelType?: keyof typeof ChannelType | null;
  audience?: Pick<IAudience, 'id'> | null;
}

export type NewChannel = Omit<IChannel, 'id'> & { id: null };
