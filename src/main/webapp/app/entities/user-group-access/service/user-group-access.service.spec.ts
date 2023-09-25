import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserGroupAccess } from '../user-group-access.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-group-access.test-samples';

import { UserGroupAccessService } from './user-group-access.service';

const requireRestSample: IUserGroupAccess = {
  ...sampleWithRequiredData,
};

describe('UserGroupAccess Service', () => {
  let service: UserGroupAccessService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserGroupAccess | IUserGroupAccess[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserGroupAccessService);
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

    it('should create a UserGroupAccess', () => {
      const userGroupAccess = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userGroupAccess).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserGroupAccess', () => {
      const userGroupAccess = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userGroupAccess).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserGroupAccess', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserGroupAccess', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserGroupAccess', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserGroupAccessToCollectionIfMissing', () => {
      it('should add a UserGroupAccess to an empty array', () => {
        const userGroupAccess: IUserGroupAccess = sampleWithRequiredData;
        expectedResult = service.addUserGroupAccessToCollectionIfMissing([], userGroupAccess);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userGroupAccess);
      });

      it('should not add a UserGroupAccess to an array that contains it', () => {
        const userGroupAccess: IUserGroupAccess = sampleWithRequiredData;
        const userGroupAccessCollection: IUserGroupAccess[] = [
          {
            ...userGroupAccess,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserGroupAccessToCollectionIfMissing(userGroupAccessCollection, userGroupAccess);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserGroupAccess to an array that doesn't contain it", () => {
        const userGroupAccess: IUserGroupAccess = sampleWithRequiredData;
        const userGroupAccessCollection: IUserGroupAccess[] = [sampleWithPartialData];
        expectedResult = service.addUserGroupAccessToCollectionIfMissing(userGroupAccessCollection, userGroupAccess);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userGroupAccess);
      });

      it('should add only unique UserGroupAccess to an array', () => {
        const userGroupAccessArray: IUserGroupAccess[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userGroupAccessCollection: IUserGroupAccess[] = [sampleWithRequiredData];
        expectedResult = service.addUserGroupAccessToCollectionIfMissing(userGroupAccessCollection, ...userGroupAccessArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userGroupAccess: IUserGroupAccess = sampleWithRequiredData;
        const userGroupAccess2: IUserGroupAccess = sampleWithPartialData;
        expectedResult = service.addUserGroupAccessToCollectionIfMissing([], userGroupAccess, userGroupAccess2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userGroupAccess);
        expect(expectedResult).toContain(userGroupAccess2);
      });

      it('should accept null and undefined values', () => {
        const userGroupAccess: IUserGroupAccess = sampleWithRequiredData;
        expectedResult = service.addUserGroupAccessToCollectionIfMissing([], null, userGroupAccess, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userGroupAccess);
      });

      it('should return initial array if no UserGroupAccess is added', () => {
        const userGroupAccessCollection: IUserGroupAccess[] = [sampleWithRequiredData];
        expectedResult = service.addUserGroupAccessToCollectionIfMissing(userGroupAccessCollection, undefined, null);
        expect(expectedResult).toEqual(userGroupAccessCollection);
      });
    });

    describe('compareUserGroupAccess', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserGroupAccess(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserGroupAccess(entity1, entity2);
        const compareResult2 = service.compareUserGroupAccess(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserGroupAccess(entity1, entity2);
        const compareResult2 = service.compareUserGroupAccess(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserGroupAccess(entity1, entity2);
        const compareResult2 = service.compareUserGroupAccess(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
