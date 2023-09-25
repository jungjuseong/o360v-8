import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProjectDate, NewProjectDate } from '../project-date.model';

export type PartialUpdateProjectDate = Partial<IProjectDate> & Pick<IProjectDate, 'id'>;

type RestOf<T extends IProjectDate | NewProjectDate> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestProjectDate = RestOf<IProjectDate>;

export type NewRestProjectDate = RestOf<NewProjectDate>;

export type PartialUpdateRestProjectDate = RestOf<PartialUpdateProjectDate>;

export type EntityResponseType = HttpResponse<IProjectDate>;
export type EntityArrayResponseType = HttpResponse<IProjectDate[]>;

@Injectable({ providedIn: 'root' })
export class ProjectDateService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/project-dates');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(projectDate: NewProjectDate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(projectDate);
    return this.http
      .post<RestProjectDate>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(projectDate: IProjectDate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(projectDate);
    return this.http
      .put<RestProjectDate>(`${this.resourceUrl}/${this.getProjectDateIdentifier(projectDate)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(projectDate: PartialUpdateProjectDate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(projectDate);
    return this.http
      .patch<RestProjectDate>(`${this.resourceUrl}/${this.getProjectDateIdentifier(projectDate)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProjectDate>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProjectDate[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProjectDateIdentifier(projectDate: Pick<IProjectDate, 'id'>): number {
    return projectDate.id;
  }

  compareProjectDate(o1: Pick<IProjectDate, 'id'> | null, o2: Pick<IProjectDate, 'id'> | null): boolean {
    return o1 && o2 ? this.getProjectDateIdentifier(o1) === this.getProjectDateIdentifier(o2) : o1 === o2;
  }

  addProjectDateToCollectionIfMissing<Type extends Pick<IProjectDate, 'id'>>(
    projectDateCollection: Type[],
    ...projectDatesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const projectDates: Type[] = projectDatesToCheck.filter(isPresent);
    if (projectDates.length > 0) {
      const projectDateCollectionIdentifiers = projectDateCollection.map(
        projectDateItem => this.getProjectDateIdentifier(projectDateItem)!,
      );
      const projectDatesToAdd = projectDates.filter(projectDateItem => {
        const projectDateIdentifier = this.getProjectDateIdentifier(projectDateItem);
        if (projectDateCollectionIdentifiers.includes(projectDateIdentifier)) {
          return false;
        }
        projectDateCollectionIdentifiers.push(projectDateIdentifier);
        return true;
      });
      return [...projectDatesToAdd, ...projectDateCollection];
    }
    return projectDateCollection;
  }

  protected convertDateFromClient<T extends IProjectDate | NewProjectDate | PartialUpdateProjectDate>(projectDate: T): RestOf<T> {
    return {
      ...projectDate,
      date: projectDate.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restProjectDate: RestProjectDate): IProjectDate {
    return {
      ...restProjectDate,
      date: restProjectDate.date ? dayjs(restProjectDate.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProjectDate>): HttpResponse<IProjectDate> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProjectDate[]>): HttpResponse<IProjectDate[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
