import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStakeholderComment, NewStakeholderComment } from '../stakeholder-comment.model';

export type PartialUpdateStakeholderComment = Partial<IStakeholderComment> & Pick<IStakeholderComment, 'id'>;

type RestOf<T extends IStakeholderComment | NewStakeholderComment> = Omit<T, 'createdDate'> & {
  createdDate?: string | null;
};

export type RestStakeholderComment = RestOf<IStakeholderComment>;

export type NewRestStakeholderComment = RestOf<NewStakeholderComment>;

export type PartialUpdateRestStakeholderComment = RestOf<PartialUpdateStakeholderComment>;

export type EntityResponseType = HttpResponse<IStakeholderComment>;
export type EntityArrayResponseType = HttpResponse<IStakeholderComment[]>;

@Injectable({ providedIn: 'root' })
export class StakeholderCommentService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/stakeholder-comments');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(stakeholderComment: NewStakeholderComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(stakeholderComment);
    return this.http
      .post<RestStakeholderComment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(stakeholderComment: IStakeholderComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(stakeholderComment);
    return this.http
      .put<RestStakeholderComment>(`${this.resourceUrl}/${this.getStakeholderCommentIdentifier(stakeholderComment)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(stakeholderComment: PartialUpdateStakeholderComment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(stakeholderComment);
    return this.http
      .patch<RestStakeholderComment>(`${this.resourceUrl}/${this.getStakeholderCommentIdentifier(stakeholderComment)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestStakeholderComment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestStakeholderComment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStakeholderCommentIdentifier(stakeholderComment: Pick<IStakeholderComment, 'id'>): number {
    return stakeholderComment.id;
  }

  compareStakeholderComment(o1: Pick<IStakeholderComment, 'id'> | null, o2: Pick<IStakeholderComment, 'id'> | null): boolean {
    return o1 && o2 ? this.getStakeholderCommentIdentifier(o1) === this.getStakeholderCommentIdentifier(o2) : o1 === o2;
  }

  addStakeholderCommentToCollectionIfMissing<Type extends Pick<IStakeholderComment, 'id'>>(
    stakeholderCommentCollection: Type[],
    ...stakeholderCommentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const stakeholderComments: Type[] = stakeholderCommentsToCheck.filter(isPresent);
    if (stakeholderComments.length > 0) {
      const stakeholderCommentCollectionIdentifiers = stakeholderCommentCollection.map(
        stakeholderCommentItem => this.getStakeholderCommentIdentifier(stakeholderCommentItem)!,
      );
      const stakeholderCommentsToAdd = stakeholderComments.filter(stakeholderCommentItem => {
        const stakeholderCommentIdentifier = this.getStakeholderCommentIdentifier(stakeholderCommentItem);
        if (stakeholderCommentCollectionIdentifiers.includes(stakeholderCommentIdentifier)) {
          return false;
        }
        stakeholderCommentCollectionIdentifiers.push(stakeholderCommentIdentifier);
        return true;
      });
      return [...stakeholderCommentsToAdd, ...stakeholderCommentCollection];
    }
    return stakeholderCommentCollection;
  }

  protected convertDateFromClient<T extends IStakeholderComment | NewStakeholderComment | PartialUpdateStakeholderComment>(
    stakeholderComment: T,
  ): RestOf<T> {
    return {
      ...stakeholderComment,
      createdDate: stakeholderComment.createdDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restStakeholderComment: RestStakeholderComment): IStakeholderComment {
    return {
      ...restStakeholderComment,
      createdDate: restStakeholderComment.createdDate ? dayjs(restStakeholderComment.createdDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestStakeholderComment>): HttpResponse<IStakeholderComment> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestStakeholderComment[]>): HttpResponse<IStakeholderComment[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
