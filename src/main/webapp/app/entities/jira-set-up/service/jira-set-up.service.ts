import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJiraSetUp, NewJiraSetUp } from '../jira-set-up.model';

export type PartialUpdateJiraSetUp = Partial<IJiraSetUp> & Pick<IJiraSetUp, 'id'>;

export type EntityResponseType = HttpResponse<IJiraSetUp>;
export type EntityArrayResponseType = HttpResponse<IJiraSetUp[]>;

@Injectable({ providedIn: 'root' })
export class JiraSetUpService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/jira-set-ups');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(jiraSetUp: NewJiraSetUp): Observable<EntityResponseType> {
    return this.http.post<IJiraSetUp>(this.resourceUrl, jiraSetUp, { observe: 'response' });
  }

  update(jiraSetUp: IJiraSetUp): Observable<EntityResponseType> {
    return this.http.put<IJiraSetUp>(`${this.resourceUrl}/${this.getJiraSetUpIdentifier(jiraSetUp)}`, jiraSetUp, { observe: 'response' });
  }

  partialUpdate(jiraSetUp: PartialUpdateJiraSetUp): Observable<EntityResponseType> {
    return this.http.patch<IJiraSetUp>(`${this.resourceUrl}/${this.getJiraSetUpIdentifier(jiraSetUp)}`, jiraSetUp, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJiraSetUp>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJiraSetUp[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getJiraSetUpIdentifier(jiraSetUp: Pick<IJiraSetUp, 'id'>): number {
    return jiraSetUp.id;
  }

  compareJiraSetUp(o1: Pick<IJiraSetUp, 'id'> | null, o2: Pick<IJiraSetUp, 'id'> | null): boolean {
    return o1 && o2 ? this.getJiraSetUpIdentifier(o1) === this.getJiraSetUpIdentifier(o2) : o1 === o2;
  }

  addJiraSetUpToCollectionIfMissing<Type extends Pick<IJiraSetUp, 'id'>>(
    jiraSetUpCollection: Type[],
    ...jiraSetUpsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const jiraSetUps: Type[] = jiraSetUpsToCheck.filter(isPresent);
    if (jiraSetUps.length > 0) {
      const jiraSetUpCollectionIdentifiers = jiraSetUpCollection.map(jiraSetUpItem => this.getJiraSetUpIdentifier(jiraSetUpItem)!);
      const jiraSetUpsToAdd = jiraSetUps.filter(jiraSetUpItem => {
        const jiraSetUpIdentifier = this.getJiraSetUpIdentifier(jiraSetUpItem);
        if (jiraSetUpCollectionIdentifiers.includes(jiraSetUpIdentifier)) {
          return false;
        }
        jiraSetUpCollectionIdentifiers.push(jiraSetUpIdentifier);
        return true;
      });
      return [...jiraSetUpsToAdd, ...jiraSetUpCollection];
    }
    return jiraSetUpCollection;
  }
}
