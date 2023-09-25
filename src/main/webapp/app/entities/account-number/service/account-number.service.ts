import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAccountNumber, NewAccountNumber } from '../account-number.model';

export type PartialUpdateAccountNumber = Partial<IAccountNumber> & Pick<IAccountNumber, 'id'>;

export type EntityResponseType = HttpResponse<IAccountNumber>;
export type EntityArrayResponseType = HttpResponse<IAccountNumber[]>;

@Injectable({ providedIn: 'root' })
export class AccountNumberService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/account-numbers');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(accountNumber: NewAccountNumber): Observable<EntityResponseType> {
    return this.http.post<IAccountNumber>(this.resourceUrl, accountNumber, { observe: 'response' });
  }

  update(accountNumber: IAccountNumber): Observable<EntityResponseType> {
    return this.http.put<IAccountNumber>(`${this.resourceUrl}/${this.getAccountNumberIdentifier(accountNumber)}`, accountNumber, {
      observe: 'response',
    });
  }

  partialUpdate(accountNumber: PartialUpdateAccountNumber): Observable<EntityResponseType> {
    return this.http.patch<IAccountNumber>(`${this.resourceUrl}/${this.getAccountNumberIdentifier(accountNumber)}`, accountNumber, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAccountNumber>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAccountNumber[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAccountNumberIdentifier(accountNumber: Pick<IAccountNumber, 'id'>): number {
    return accountNumber.id;
  }

  compareAccountNumber(o1: Pick<IAccountNumber, 'id'> | null, o2: Pick<IAccountNumber, 'id'> | null): boolean {
    return o1 && o2 ? this.getAccountNumberIdentifier(o1) === this.getAccountNumberIdentifier(o2) : o1 === o2;
  }

  addAccountNumberToCollectionIfMissing<Type extends Pick<IAccountNumber, 'id'>>(
    accountNumberCollection: Type[],
    ...accountNumbersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const accountNumbers: Type[] = accountNumbersToCheck.filter(isPresent);
    if (accountNumbers.length > 0) {
      const accountNumberCollectionIdentifiers = accountNumberCollection.map(
        accountNumberItem => this.getAccountNumberIdentifier(accountNumberItem)!,
      );
      const accountNumbersToAdd = accountNumbers.filter(accountNumberItem => {
        const accountNumberIdentifier = this.getAccountNumberIdentifier(accountNumberItem);
        if (accountNumberCollectionIdentifiers.includes(accountNumberIdentifier)) {
          return false;
        }
        accountNumberCollectionIdentifiers.push(accountNumberIdentifier);
        return true;
      });
      return [...accountNumbersToAdd, ...accountNumberCollection];
    }
    return accountNumberCollection;
  }
}
