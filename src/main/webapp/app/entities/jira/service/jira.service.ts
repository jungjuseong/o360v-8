import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJira, NewJira } from '../jira.model';

export type PartialUpdateJira = Partial<IJira> & Pick<IJira, 'id'>;

export type EntityResponseType = HttpResponse<IJira>;
export type EntityArrayResponseType = HttpResponse<IJira[]>;

@Injectable({ providedIn: 'root' })
export class JiraService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/jiras');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(jira: NewJira): Observable<EntityResponseType> {
    return this.http.post<IJira>(this.resourceUrl, jira, { observe: 'response' });
  }

  update(jira: IJira): Observable<EntityResponseType> {
    return this.http.put<IJira>(`${this.resourceUrl}/${this.getJiraIdentifier(jira)}`, jira, { observe: 'response' });
  }

  partialUpdate(jira: PartialUpdateJira): Observable<EntityResponseType> {
    return this.http.patch<IJira>(`${this.resourceUrl}/${this.getJiraIdentifier(jira)}`, jira, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJira>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJira[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getJiraIdentifier(jira: Pick<IJira, 'id'>): number {
    return jira.id;
  }

  compareJira(o1: Pick<IJira, 'id'> | null, o2: Pick<IJira, 'id'> | null): boolean {
    return o1 && o2 ? this.getJiraIdentifier(o1) === this.getJiraIdentifier(o2) : o1 === o2;
  }

  addJiraToCollectionIfMissing<Type extends Pick<IJira, 'id'>>(
    jiraCollection: Type[],
    ...jirasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const jiras: Type[] = jirasToCheck.filter(isPresent);
    if (jiras.length > 0) {
      const jiraCollectionIdentifiers = jiraCollection.map(jiraItem => this.getJiraIdentifier(jiraItem)!);
      const jirasToAdd = jiras.filter(jiraItem => {
        const jiraIdentifier = this.getJiraIdentifier(jiraItem);
        if (jiraCollectionIdentifiers.includes(jiraIdentifier)) {
          return false;
        }
        jiraCollectionIdentifiers.push(jiraIdentifier);
        return true;
      });
      return [...jirasToAdd, ...jiraCollection];
    }
    return jiraCollection;
  }
}
