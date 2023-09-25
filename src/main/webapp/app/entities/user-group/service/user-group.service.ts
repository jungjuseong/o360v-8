import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserGroup, NewUserGroup } from '../user-group.model';

export type PartialUpdateUserGroup = Partial<IUserGroup> & Pick<IUserGroup, 'id'>;

export type EntityResponseType = HttpResponse<IUserGroup>;
export type EntityArrayResponseType = HttpResponse<IUserGroup[]>;

@Injectable({ providedIn: 'root' })
export class UserGroupService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-groups');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(userGroup: NewUserGroup): Observable<EntityResponseType> {
    return this.http.post<IUserGroup>(this.resourceUrl, userGroup, { observe: 'response' });
  }

  update(userGroup: IUserGroup): Observable<EntityResponseType> {
    return this.http.put<IUserGroup>(`${this.resourceUrl}/${this.getUserGroupIdentifier(userGroup)}`, userGroup, { observe: 'response' });
  }

  partialUpdate(userGroup: PartialUpdateUserGroup): Observable<EntityResponseType> {
    return this.http.patch<IUserGroup>(`${this.resourceUrl}/${this.getUserGroupIdentifier(userGroup)}`, userGroup, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserGroup>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserGroup[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserGroupIdentifier(userGroup: Pick<IUserGroup, 'id'>): number {
    return userGroup.id;
  }

  compareUserGroup(o1: Pick<IUserGroup, 'id'> | null, o2: Pick<IUserGroup, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserGroupIdentifier(o1) === this.getUserGroupIdentifier(o2) : o1 === o2;
  }

  addUserGroupToCollectionIfMissing<Type extends Pick<IUserGroup, 'id'>>(
    userGroupCollection: Type[],
    ...userGroupsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userGroups: Type[] = userGroupsToCheck.filter(isPresent);
    if (userGroups.length > 0) {
      const userGroupCollectionIdentifiers = userGroupCollection.map(userGroupItem => this.getUserGroupIdentifier(userGroupItem)!);
      const userGroupsToAdd = userGroups.filter(userGroupItem => {
        const userGroupIdentifier = this.getUserGroupIdentifier(userGroupItem);
        if (userGroupCollectionIdentifiers.includes(userGroupIdentifier)) {
          return false;
        }
        userGroupCollectionIdentifiers.push(userGroupIdentifier);
        return true;
      });
      return [...userGroupsToAdd, ...userGroupCollection];
    }
    return userGroupCollection;
  }
}
