import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IStakeholder } from '../stakeholder.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../stakeholder.test-samples';

import { StakeholderService, RestStakeholder } from './stakeholder.service';

const requireRestSample: RestStakeholder = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.format(DATE_FORMAT),
};

describe('Stakeholder Service', () => {
  let service: StakeholderService;
  let httpMock: HttpTestingController;
  let expectedResult: IStakeholder | IStakeholder[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StakeholderService);
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

    it('should create a Stakeholder', () => {
      const stakeholder = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(stakeholder).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Stakeholder', () => {
      const stakeholder = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(stakeholder).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Stakeholder', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Stakeholder', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Stakeholder', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addStakeholderToCollectionIfMissing', () => {
      it('should add a Stakeholder to an empty array', () => {
        const stakeholder: IStakeholder = sampleWithRequiredData;
        expectedResult = service.addStakeholderToCollectionIfMissing([], stakeholder);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stakeholder);
      });

      it('should not add a Stakeholder to an array that contains it', () => {
        const stakeholder: IStakeholder = sampleWithRequiredData;
        const stakeholderCollection: IStakeholder[] = [
          {
            ...stakeholder,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStakeholderToCollectionIfMissing(stakeholderCollection, stakeholder);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Stakeholder to an array that doesn't contain it", () => {
        const stakeholder: IStakeholder = sampleWithRequiredData;
        const stakeholderCollection: IStakeholder[] = [sampleWithPartialData];
        expectedResult = service.addStakeholderToCollectionIfMissing(stakeholderCollection, stakeholder);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stakeholder);
      });

      it('should add only unique Stakeholder to an array', () => {
        const stakeholderArray: IStakeholder[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const stakeholderCollection: IStakeholder[] = [sampleWithRequiredData];
        expectedResult = service.addStakeholderToCollectionIfMissing(stakeholderCollection, ...stakeholderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const stakeholder: IStakeholder = sampleWithRequiredData;
        const stakeholder2: IStakeholder = sampleWithPartialData;
        expectedResult = service.addStakeholderToCollectionIfMissing([], stakeholder, stakeholder2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stakeholder);
        expect(expectedResult).toContain(stakeholder2);
      });

      it('should accept null and undefined values', () => {
        const stakeholder: IStakeholder = sampleWithRequiredData;
        expectedResult = service.addStakeholderToCollectionIfMissing([], null, stakeholder, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stakeholder);
      });

      it('should return initial array if no Stakeholder is added', () => {
        const stakeholderCollection: IStakeholder[] = [sampleWithRequiredData];
        expectedResult = service.addStakeholderToCollectionIfMissing(stakeholderCollection, undefined, null);
        expect(expectedResult).toEqual(stakeholderCollection);
      });
    });

    describe('compareStakeholder', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStakeholder(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareStakeholder(entity1, entity2);
        const compareResult2 = service.compareStakeholder(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareStakeholder(entity1, entity2);
        const compareResult2 = service.compareStakeholder(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareStakeholder(entity1, entity2);
        const compareResult2 = service.compareStakeholder(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
