import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStakeholder, NewStakeholder } from '../stakeholder.model';

export type PartialUpdateStakeholder = Partial<IStakeholder> & Pick<IStakeholder, 'id'>;

type RestOf<T extends IStakeholder | NewStakeholder> = Omit<T, 'createdDate'> & {
  createdDate?: string | null;
};

export type RestStakeholder = RestOf<IStakeholder>;

export type NewRestStakeholder = RestOf<NewStakeholder>;

export type PartialUpdateRestStakeholder = RestOf<PartialUpdateStakeholder>;

export type EntityResponseType = HttpResponse<IStakeholder>;
export type EntityArrayResponseType = HttpResponse<IStakeholder[]>;

@Injectable({ providedIn: 'root' })
export class StakeholderService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/stakeholders');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(stakeholder: NewStakeholder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(stakeholder);
    return this.http
      .post<RestStakeholder>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(stakeholder: IStakeholder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(stakeholder);
    return this.http
      .put<RestStakeholder>(`${this.resourceUrl}/${this.getStakeholderIdentifier(stakeholder)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(stakeholder: PartialUpdateStakeholder): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(stakeholder);
    return this.http
      .patch<RestStakeholder>(`${this.resourceUrl}/${this.getStakeholderIdentifier(stakeholder)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestStakeholder>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestStakeholder[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStakeholderIdentifier(stakeholder: Pick<IStakeholder, 'id'>): number {
    return stakeholder.id;
  }

  compareStakeholder(o1: Pick<IStakeholder, 'id'> | null, o2: Pick<IStakeholder, 'id'> | null): boolean {
    return o1 && o2 ? this.getStakeholderIdentifier(o1) === this.getStakeholderIdentifier(o2) : o1 === o2;
  }

  addStakeholderToCollectionIfMissing<Type extends Pick<IStakeholder, 'id'>>(
    stakeholderCollection: Type[],
    ...stakeholdersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const stakeholders: Type[] = stakeholdersToCheck.filter(isPresent);
    if (stakeholders.length > 0) {
      const stakeholderCollectionIdentifiers = stakeholderCollection.map(
        stakeholderItem => this.getStakeholderIdentifier(stakeholderItem)!,
      );
      const stakeholdersToAdd = stakeholders.filter(stakeholderItem => {
        const stakeholderIdentifier = this.getStakeholderIdentifier(stakeholderItem);
        if (stakeholderCollectionIdentifiers.includes(stakeholderIdentifier)) {
          return false;
        }
        stakeholderCollectionIdentifiers.push(stakeholderIdentifier);
        return true;
      });
      return [...stakeholdersToAdd, ...stakeholderCollection];
    }
    return stakeholderCollection;
  }

  protected convertDateFromClient<T extends IStakeholder | NewStakeholder | PartialUpdateStakeholder>(stakeholder: T): RestOf<T> {
    return {
      ...stakeholder,
      createdDate: stakeholder.createdDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restStakeholder: RestStakeholder): IStakeholder {
    return {
      ...restStakeholder,
      createdDate: restStakeholder.createdDate ? dayjs(restStakeholder.createdDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestStakeholder>): HttpResponse<IStakeholder> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestStakeholder[]>): HttpResponse<IStakeholder[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
