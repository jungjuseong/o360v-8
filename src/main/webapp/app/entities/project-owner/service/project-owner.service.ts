import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProjectOwner, NewProjectOwner } from '../project-owner.model';

export type PartialUpdateProjectOwner = Partial<IProjectOwner> & Pick<IProjectOwner, 'id'>;

export type EntityResponseType = HttpResponse<IProjectOwner>;
export type EntityArrayResponseType = HttpResponse<IProjectOwner[]>;

@Injectable({ providedIn: 'root' })
export class ProjectOwnerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/project-owners');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(projectOwner: NewProjectOwner): Observable<EntityResponseType> {
    return this.http.post<IProjectOwner>(this.resourceUrl, projectOwner, { observe: 'response' });
  }

  update(projectOwner: IProjectOwner): Observable<EntityResponseType> {
    return this.http.put<IProjectOwner>(`${this.resourceUrl}/${this.getProjectOwnerIdentifier(projectOwner)}`, projectOwner, {
      observe: 'response',
    });
  }

  partialUpdate(projectOwner: PartialUpdateProjectOwner): Observable<EntityResponseType> {
    return this.http.patch<IProjectOwner>(`${this.resourceUrl}/${this.getProjectOwnerIdentifier(projectOwner)}`, projectOwner, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProjectOwner>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProjectOwner[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProjectOwnerIdentifier(projectOwner: Pick<IProjectOwner, 'id'>): number {
    return projectOwner.id;
  }

  compareProjectOwner(o1: Pick<IProjectOwner, 'id'> | null, o2: Pick<IProjectOwner, 'id'> | null): boolean {
    return o1 && o2 ? this.getProjectOwnerIdentifier(o1) === this.getProjectOwnerIdentifier(o2) : o1 === o2;
  }

  addProjectOwnerToCollectionIfMissing<Type extends Pick<IProjectOwner, 'id'>>(
    projectOwnerCollection: Type[],
    ...projectOwnersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const projectOwners: Type[] = projectOwnersToCheck.filter(isPresent);
    if (projectOwners.length > 0) {
      const projectOwnerCollectionIdentifiers = projectOwnerCollection.map(
        projectOwnerItem => this.getProjectOwnerIdentifier(projectOwnerItem)!,
      );
      const projectOwnersToAdd = projectOwners.filter(projectOwnerItem => {
        const projectOwnerIdentifier = this.getProjectOwnerIdentifier(projectOwnerItem);
        if (projectOwnerCollectionIdentifiers.includes(projectOwnerIdentifier)) {
          return false;
        }
        projectOwnerCollectionIdentifiers.push(projectOwnerIdentifier);
        return true;
      });
      return [...projectOwnersToAdd, ...projectOwnerCollection];
    }
    return projectOwnerCollection;
  }
}
