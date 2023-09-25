import { IArea } from 'app/entities/area/area.model';
import { IBrand } from 'app/entities/brand/brand.model';
import { IAudience } from 'app/entities/audience/audience.model';
import { IChannel } from 'app/entities/channel/channel.model';
import { ICountry } from 'app/entities/country/country.model';
import { IUserGroup } from 'app/entities/user-group/user-group.model';

export interface IUserGroupAccess {
  id: number;
  area?: Pick<IArea, 'id' | 'name'> | null;
  brand?: Pick<IBrand, 'id' | 'name'> | null;
  audience?: Pick<IAudience, 'id'> | null;
  channel?: Pick<IChannel, 'id'> | null;
  country?: Pick<ICountry, 'id' | 'name'> | null;
  userGroup?: Pick<IUserGroup, 'id' | 'name'> | null;
}

export type NewUserGroupAccess = Omit<IUserGroupAccess, 'id'> & { id: null };
