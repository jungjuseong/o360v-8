import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICostCenter } from '../cost-center.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../cost-center.test-samples';

import { CostCenterService } from './cost-center.service';

const requireRestSample: ICostCenter = {
  ...sampleWithRequiredData,
};

describe('CostCenter Service', () => {
  let service: CostCenterService;
  let httpMock: HttpTestingController;
  let expectedResult: ICostCenter | ICostCenter[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CostCenterService);
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

    it('should create a CostCenter', () => {
      const costCenter = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(costCenter).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CostCenter', () => {
      const costCenter = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(costCenter).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CostCenter', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CostCenter', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CostCenter', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCostCenterToCollectionIfMissing', () => {
      it('should add a CostCenter to an empty array', () => {
        const costCenter: ICostCenter = sampleWithRequiredData;
        expectedResult = service.addCostCenterToCollectionIfMissing([], costCenter);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(costCenter);
      });

      it('should not add a CostCenter to an array that contains it', () => {
        const costCenter: ICostCenter = sampleWithRequiredData;
        const costCenterCollection: ICostCenter[] = [
          {
            ...costCenter,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCostCenterToCollectionIfMissing(costCenterCollection, costCenter);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CostCenter to an array that doesn't contain it", () => {
        const costCenter: ICostCenter = sampleWithRequiredData;
        const costCenterCollection: ICostCenter[] = [sampleWithPartialData];
        expectedResult = service.addCostCenterToCollectionIfMissing(costCenterCollection, costCenter);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(costCenter);
      });

      it('should add only unique CostCenter to an array', () => {
        const costCenterArray: ICostCenter[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const costCenterCollection: ICostCenter[] = [sampleWithRequiredData];
        expectedResult = service.addCostCenterToCollectionIfMissing(costCenterCollection, ...costCenterArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const costCenter: ICostCenter = sampleWithRequiredData;
        const costCenter2: ICostCenter = sampleWithPartialData;
        expectedResult = service.addCostCenterToCollectionIfMissing([], costCenter, costCenter2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(costCenter);
        expect(expectedResult).toContain(costCenter2);
      });

      it('should accept null and undefined values', () => {
        const costCenter: ICostCenter = sampleWithRequiredData;
        expectedResult = service.addCostCenterToCollectionIfMissing([], null, costCenter, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(costCenter);
      });

      it('should return initial array if no CostCenter is added', () => {
        const costCenterCollection: ICostCenter[] = [sampleWithRequiredData];
        expectedResult = service.addCostCenterToCollectionIfMissing(costCenterCollection, undefined, null);
        expect(expectedResult).toEqual(costCenterCollection);
      });
    });

    describe('compareCostCenter', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCostCenter(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCostCenter(entity1, entity2);
        const compareResult2 = service.compareCostCenter(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCostCenter(entity1, entity2);
        const compareResult2 = service.compareCostCenter(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCostCenter(entity1, entity2);
        const compareResult2 = service.compareCostCenter(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
