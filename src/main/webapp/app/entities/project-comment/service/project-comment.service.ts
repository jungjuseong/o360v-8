import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProjectComment, NewProjectComment } from '../project-comment.model';

export type PartialUpdateProjectComment = Partial<IProjectComment> & Pick<IProjectComment, 'id'>;

type RestOf<T extends IProjectComment | NewProjectComment> = Omit<T, 'createdDate'> & {
  createdDate?: string | null;
};

export type RestProjectComment = RestOf<IProjectComment>;

export type NewRestProjectComment = RestOf<NewProjectComment>;

export type PartialUpdateRestProjectComment = RestOf<PartialUpdateProjectComment>;

export type EntityResponseType = HttpResponse<IProjectComment>;
export type EntityArrayResponseType = HttpResponse<IProjectComment[]>;

@Injectable({ providedIn: 'root' })
export class ProjectCommentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/project-comments');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(projectComment: NewProjectComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(projectComment);
    return this.http
      .post<RestProjectComment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(projectComment: IProjectComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(projectComment);
    return this.http
      .put<RestProjectComment>(`${this.resourceUrl}/${this.getProjectCommentIdentifier(projectComment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(projectComment: PartialUpdateProjectComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(projectComment);
    return this.http
      .patch<RestProjectComment>(`${this.resourceUrl}/${this.getProjectCommentIdentifier(projectComment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestProjectComment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestProjectComment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProjectCommentIdentifier(projectComment: Pick<IProjectComment, 'id'>): number {
    return projectComment.id;
  }

  compareProjectComment(o1: Pick<IProjectComment, 'id'> | null, o2: Pick<IProjectComment, 'id'> | null): boolean {
    return o1 && o2 ? this.getProjectCommentIdentifier(o1) === this.getProjectCommentIdentifier(o2) : o1 === o2;
  }

  addProjectCommentToCollectionIfMissing<Type extends Pick<IProjectComment, 'id'>>(
    projectCommentCollection: Type[],
    ...projectCommentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const projectComments: Type[] = projectCommentsToCheck.filter(isPresent);
    if (projectComments.length > 0) {
      const projectCommentCollectionIdentifiers = projectCommentCollection.map(
        projectCommentItem => this.getProjectCommentIdentifier(projectCommentItem)!,
      );
      const projectCommentsToAdd = projectComments.filter(projectCommentItem => {
        const projectCommentIdentifier = this.getProjectCommentIdentifier(projectCommentItem);
        if (projectCommentCollectionIdentifiers.includes(projectCommentIdentifier)) {
          return false;
        }
        projectCommentCollectionIdentifiers.push(projectCommentIdentifier);
        return true;
      });
      return [...projectCommentsToAdd, ...projectCommentCollection];
    }
    return projectCommentCollection;
  }

  protected convertDateFromClient<T extends IProjectComment | NewProjectComment | PartialUpdateProjectComment>(
    projectComment: T,
  ): RestOf<T> {
    return {
      ...projectComment,
      createdDate: projectComment.createdDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restProjectComment: RestProjectComment): IProjectComment {
    return {
      ...restProjectComment,
      createdDate: restProjectComment.createdDate ? dayjs(restProjectComment.createdDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProjectComment>): HttpResponse<IProjectComment> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProjectComment[]>): HttpResponse<IProjectComment[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
