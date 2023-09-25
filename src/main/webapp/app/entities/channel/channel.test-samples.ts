import { IChannel, NewChannel } from './channel.model';

export const sampleWithRequiredData: IChannel = {
  id: 7189,
};

export const sampleWithPartialData: IChannel = {
  id: 8787,
};

export const sampleWithFullData: IChannel = {
  id: 11971,
  channelType: 'PHONE',
};

export const sampleWithNewData: NewChannel = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
