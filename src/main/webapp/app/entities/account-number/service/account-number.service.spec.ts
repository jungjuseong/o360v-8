import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAccountNumber } from '../account-number.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../account-number.test-samples';

import { AccountNumberService } from './account-number.service';

const requireRestSample: IAccountNumber = {
  ...sampleWithRequiredData,
};

describe('AccountNumber Service', () => {
  let service: AccountNumberService;
  let httpMock: HttpTestingController;
  let expectedResult: IAccountNumber | IAccountNumber[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AccountNumberService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a AccountNumber', () => {
      const accountNumber = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(accountNumber).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AccountNumber', () => {
      const accountNumber = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(accountNumber).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AccountNumber', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AccountNumber', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AccountNumber', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAccountNumberToCollectionIfMissing', () => {
      it('should add a AccountNumber to an empty array', () => {
        const accountNumber: IAccountNumber = sampleWithRequiredData;
        expectedResult = service.addAccountNumberToCollectionIfMissing([], accountNumber);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(accountNumber);
      });

      it('should not add a AccountNumber to an array that contains it', () => {
        const accountNumber: IAccountNumber = sampleWithRequiredData;
        const accountNumberCollection: IAccountNumber[] = [
          {
            ...accountNumber,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAccountNumberToCollectionIfMissing(accountNumberCollection, accountNumber);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AccountNumber to an array that doesn't contain it", () => {
        const accountNumber: IAccountNumber = sampleWithRequiredData;
        const accountNumberCollection: IAccountNumber[] = [sampleWithPartialData];
        expectedResult = service.addAccountNumberToCollectionIfMissing(accountNumberCollection, accountNumber);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accountNumber);
      });

      it('should add only unique AccountNumber to an array', () => {
        const accountNumberArray: IAccountNumber[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const accountNumberCollection: IAccountNumber[] = [sampleWithRequiredData];
        expectedResult = service.addAccountNumberToCollectionIfMissing(accountNumberCollection, ...accountNumberArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const accountNumber: IAccountNumber = sampleWithRequiredData;
        const accountNumber2: IAccountNumber = sampleWithPartialData;
        expectedResult = service.addAccountNumberToCollectionIfMissing([], accountNumber, accountNumber2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(accountNumber);
        expect(expectedResult).toContain(accountNumber2);
      });

      it('should accept null and undefined values', () => {
        const accountNumber: IAccountNumber = sampleWithRequiredData;
        expectedResult = service.addAccountNumberToCollectionIfMissing([], null, accountNumber, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(accountNumber);
      });

      it('should return initial array if no AccountNumber is added', () => {
        const accountNumberCollection: IAccountNumber[] = [sampleWithRequiredData];
        expectedResult = service.addAccountNumberToCollectionIfMissing(accountNumberCollection, undefined, null);
        expect(expectedResult).toEqual(accountNumberCollection);
      });
    });

    describe('compareAccountNumber', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAccountNumber(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAccountNumber(entity1, entity2);
        const compareResult2 = service.compareAccountNumber(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAccountNumber(entity1, entity2);
        const compareResult2 = service.compareAccountNumber(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAccountNumber(entity1, entity2);
        const compareResult2 = service.compareAccountNumber(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
