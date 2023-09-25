import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAudience, NewAudience } from '../audience.model';

export type PartialUpdateAudience = Partial<IAudience> & Pick<IAudience, 'id'>;

export type EntityResponseType = HttpResponse<IAudience>;
export type EntityArrayResponseType = HttpResponse<IAudience[]>;

@Injectable({ providedIn: 'root' })
export class AudienceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/audiences');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(audience: NewAudience): Observable<EntityResponseType> {
    return this.http.post<IAudience>(this.resourceUrl, audience, { observe: 'response' });
  }

  update(audience: IAudience): Observable<EntityResponseType> {
    return this.http.put<IAudience>(`${this.resourceUrl}/${this.getAudienceIdentifier(audience)}`, audience, { observe: 'response' });
  }

  partialUpdate(audience: PartialUpdateAudience): Observable<EntityResponseType> {
    return this.http.patch<IAudience>(`${this.resourceUrl}/${this.getAudienceIdentifier(audience)}`, audience, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAudience>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAudience[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAudienceIdentifier(audience: Pick<IAudience, 'id'>): number {
    return audience.id;
  }

  compareAudience(o1: Pick<IAudience, 'id'> | null, o2: Pick<IAudience, 'id'> | null): boolean {
    return o1 && o2 ? this.getAudienceIdentifier(o1) === this.getAudienceIdentifier(o2) : o1 === o2;
  }

  addAudienceToCollectionIfMissing<Type extends Pick<IAudience, 'id'>>(
    audienceCollection: Type[],
    ...audiencesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const audiences: Type[] = audiencesToCheck.filter(isPresent);
    if (audiences.length > 0) {
      const audienceCollectionIdentifiers = audienceCollection.map(audienceItem => this.getAudienceIdentifier(audienceItem)!);
      const audiencesToAdd = audiences.filter(audienceItem => {
        const audienceIdentifier = this.getAudienceIdentifier(audienceItem);
        if (audienceCollectionIdentifiers.includes(audienceIdentifier)) {
          return false;
        }
        audienceCollectionIdentifiers.push(audienceIdentifier);
        return true;
      });
      return [...audiencesToAdd, ...audienceCollection];
    }
    return audienceCollection;
  }
}
