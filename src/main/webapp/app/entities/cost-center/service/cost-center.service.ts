import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICostCenter, NewCostCenter } from '../cost-center.model';

export type PartialUpdateCostCenter = Partial<ICostCenter> & Pick<ICostCenter, 'id'>;

export type EntityResponseType = HttpResponse<ICostCenter>;
export type EntityArrayResponseType = HttpResponse<ICostCenter[]>;

@Injectable({ providedIn: 'root' })
export class CostCenterService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cost-centers');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(costCenter: NewCostCenter): Observable<EntityResponseType> {
    return this.http.post<ICostCenter>(this.resourceUrl, costCenter, { observe: 'response' });
  }

  update(costCenter: ICostCenter): Observable<EntityResponseType> {
    return this.http.put<ICostCenter>(`${this.resourceUrl}/${this.getCostCenterIdentifier(costCenter)}`, costCenter, {
      observe: 'response',
    });
  }

  partialUpdate(costCenter: PartialUpdateCostCenter): Observable<EntityResponseType> {
    return this.http.patch<ICostCenter>(`${this.resourceUrl}/${this.getCostCenterIdentifier(costCenter)}`, costCenter, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICostCenter>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICostCenter[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCostCenterIdentifier(costCenter: Pick<ICostCenter, 'id'>): number {
    return costCenter.id;
  }

  compareCostCenter(o1: Pick<ICostCenter, 'id'> | null, o2: Pick<ICostCenter, 'id'> | null): boolean {
    return o1 && o2 ? this.getCostCenterIdentifier(o1) === this.getCostCenterIdentifier(o2) : o1 === o2;
  }

  addCostCenterToCollectionIfMissing<Type extends Pick<ICostCenter, 'id'>>(
    costCenterCollection: Type[],
    ...costCentersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const costCenters: Type[] = costCentersToCheck.filter(isPresent);
    if (costCenters.length > 0) {
      const costCenterCollectionIdentifiers = costCenterCollection.map(costCenterItem => this.getCostCenterIdentifier(costCenterItem)!);
      const costCentersToAdd = costCenters.filter(costCenterItem => {
        const costCenterIdentifier = this.getCostCenterIdentifier(costCenterItem);
        if (costCenterCollectionIdentifiers.includes(costCenterIdentifier)) {
          return false;
        }
        costCenterCollectionIdentifiers.push(costCenterIdentifier);
        return true;
      });
      return [...costCentersToAdd, ...costCenterCollection];
    }
    return costCenterCollection;
  }
}
