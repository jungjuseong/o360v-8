import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProjectFile, NewProjectFile } from '../project-file.model';

export type PartialUpdateProjectFile = Partial<IProjectFile> & Pick<IProjectFile, 'id'>;

export type EntityResponseType = HttpResponse<IProjectFile>;
export type EntityArrayResponseType = HttpResponse<IProjectFile[]>;

@Injectable({ providedIn: 'root' })
export class ProjectFileService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/project-files');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(projectFile: NewProjectFile): Observable<EntityResponseType> {
    return this.http.post<IProjectFile>(this.resourceUrl, projectFile, { observe: 'response' });
  }

  update(projectFile: IProjectFile): Observable<EntityResponseType> {
    return this.http.put<IProjectFile>(`${this.resourceUrl}/${this.getProjectFileIdentifier(projectFile)}`, projectFile, {
      observe: 'response',
    });
  }

  partialUpdate(projectFile: PartialUpdateProjectFile): Observable<EntityResponseType> {
    return this.http.patch<IProjectFile>(`${this.resourceUrl}/${this.getProjectFileIdentifier(projectFile)}`, projectFile, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProjectFile>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProjectFile[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProjectFileIdentifier(projectFile: Pick<IProjectFile, 'id'>): number {
    return projectFile.id;
  }

  compareProjectFile(o1: Pick<IProjectFile, 'id'> | null, o2: Pick<IProjectFile, 'id'> | null): boolean {
    return o1 && o2 ? this.getProjectFileIdentifier(o1) === this.getProjectFileIdentifier(o2) : o1 === o2;
  }

  addProjectFileToCollectionIfMissing<Type extends Pick<IProjectFile, 'id'>>(
    projectFileCollection: Type[],
    ...projectFilesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const projectFiles: Type[] = projectFilesToCheck.filter(isPresent);
    if (projectFiles.length > 0) {
      const projectFileCollectionIdentifiers = projectFileCollection.map(
        projectFileItem => this.getProjectFileIdentifier(projectFileItem)!,
      );
      const projectFilesToAdd = projectFiles.filter(projectFileItem => {
        const projectFileIdentifier = this.getProjectFileIdentifier(projectFileItem);
        if (projectFileCollectionIdentifiers.includes(projectFileIdentifier)) {
          return false;
        }
        projectFileCollectionIdentifiers.push(projectFileIdentifier);
        return true;
      });
      return [...projectFilesToAdd, ...projectFileCollection];
    }
    return projectFileCollection;
  }
}
