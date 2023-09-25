import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserGroupAccess, NewUserGroupAccess } from '../user-group-access.model';

export type PartialUpdateUserGroupAccess = Partial<IUserGroupAccess> & Pick<IUserGroupAccess, 'id'>;

export type EntityResponseType = HttpResponse<IUserGroupAccess>;
export type EntityArrayResponseType = HttpResponse<IUserGroupAccess[]>;

@Injectable({ providedIn: 'root' })
export class UserGroupAccessService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-group-accesses');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(userGroupAccess: NewUserGroupAccess): Observable<EntityResponseType> {
    return this.http.post<IUserGroupAccess>(this.resourceUrl, userGroupAccess, { observe: 'response' });
  }

  update(userGroupAccess: IUserGroupAccess): Observable<EntityResponseType> {
    return this.http.put<IUserGroupAccess>(`${this.resourceUrl}/${this.getUserGroupAccessIdentifier(userGroupAccess)}`, userGroupAccess, {
      observe: 'response',
    });
  }

  partialUpdate(userGroupAccess: PartialUpdateUserGroupAccess): Observable<EntityResponseType> {
    return this.http.patch<IUserGroupAccess>(`${this.resourceUrl}/${this.getUserGroupAccessIdentifier(userGroupAccess)}`, userGroupAccess, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserGroupAccess>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserGroupAccess[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserGroupAccessIdentifier(userGroupAccess: Pick<IUserGroupAccess, 'id'>): number {
    return userGroupAccess.id;
  }

  compareUserGroupAccess(o1: Pick<IUserGroupAccess, 'id'> | null, o2: Pick<IUserGroupAccess, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserGroupAccessIdentifier(o1) === this.getUserGroupAccessIdentifier(o2) : o1 === o2;
  }

  addUserGroupAccessToCollectionIfMissing<Type extends Pick<IUserGroupAccess, 'id'>>(
    userGroupAccessCollection: Type[],
    ...userGroupAccessesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userGroupAccesses: Type[] = userGroupAccessesToCheck.filter(isPresent);
    if (userGroupAccesses.length > 0) {
      const userGroupAccessCollectionIdentifiers = userGroupAccessCollection.map(
        userGroupAccessItem => this.getUserGroupAccessIdentifier(userGroupAccessItem)!,
      );
      const userGroupAccessesToAdd = userGroupAccesses.filter(userGroupAccessItem => {
        const userGroupAccessIdentifier = this.getUserGroupAccessIdentifier(userGroupAccessItem);
        if (userGroupAccessCollectionIdentifiers.includes(userGroupAccessIdentifier)) {
          return false;
        }
        userGroupAccessCollectionIdentifiers.push(userGroupAccessIdentifier);
        return true;
      });
      return [...userGroupAccessesToAdd, ...userGroupAccessCollection];
    }
    return userGroupAccessCollection;
  }
}
