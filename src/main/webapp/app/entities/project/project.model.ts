import dayjs from 'dayjs/esm';
import { ICountry } from 'app/entities/country/country.model';
import { IProjectGoal } from 'app/entities/project-goal/project-goal.model';
import { IChannel } from 'app/entities/channel/channel.model';
import { ICostCenter } from 'app/entities/cost-center/cost-center.model';
import { IAccountNumber } from 'app/entities/account-number/account-number.model';
import { IProjectOwner } from 'app/entities/project-owner/project-owner.model';
import { ProjectStatus } from 'app/entities/enumerations/project-status.model';
import { ProjectFinancialStatus } from 'app/entities/enumerations/project-financial-status.model';

export interface IProject {
  id: number;
  code?: string | null;
  title?: string | null;
  fiscalYear?: dayjs.Dayjs | null;
  budget?: number | null;
  createdDate?: dayjs.Dayjs | null;
  startDate?: dayjs.Dayjs | null;
  deploymentDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  description?: string | null;
  poNumber?: string | null;
  jiraCode?: string | null;
  jiraUpdate?: dayjs.Dayjs | null;
  projectStatus?: keyof typeof ProjectStatus | null;
  projectFinancialStatus?: keyof typeof ProjectFinancialStatus | null;
  countries?: Pick<ICountry, 'id'>[] | null;
  parentProject?: Pick<IProject, 'id' | 'code'> | null;
  goal?: Pick<IProjectGoal, 'id' | 'name'> | null;
  channel?: Pick<IChannel, 'id'> | null;
  costCenter?: Pick<ICostCenter, 'id' | 'costCenter'> | null;
  accountNumber?: Pick<IAccountNumber, 'id' | 'accountNumber'> | null;
  projectOwner?: Pick<IProjectOwner, 'id' | 'name'> | null;
}

export type NewProject = Omit<IProject, 'id'> & { id: null };
