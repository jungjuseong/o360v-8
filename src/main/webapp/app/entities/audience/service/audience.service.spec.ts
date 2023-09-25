import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAudience } from '../audience.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../audience.test-samples';

import { AudienceService } from './audience.service';

const requireRestSample: IAudience = {
  ...sampleWithRequiredData,
};

describe('Audience Service', () => {
  let service: AudienceService;
  let httpMock: HttpTestingController;
  let expectedResult: IAudience | IAudience[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AudienceService);
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

    it('should create a Audience', () => {
      const audience = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(audience).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Audience', () => {
      const audience = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(audience).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Audience', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Audience', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Audience', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAudienceToCollectionIfMissing', () => {
      it('should add a Audience to an empty array', () => {
        const audience: IAudience = sampleWithRequiredData;
        expectedResult = service.addAudienceToCollectionIfMissing([], audience);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(audience);
      });

      it('should not add a Audience to an array that contains it', () => {
        const audience: IAudience = sampleWithRequiredData;
        const audienceCollection: IAudience[] = [
          {
            ...audience,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAudienceToCollectionIfMissing(audienceCollection, audience);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Audience to an array that doesn't contain it", () => {
        const audience: IAudience = sampleWithRequiredData;
        const audienceCollection: IAudience[] = [sampleWithPartialData];
        expectedResult = service.addAudienceToCollectionIfMissing(audienceCollection, audience);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(audience);
      });

      it('should add only unique Audience to an array', () => {
        const audienceArray: IAudience[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const audienceCollection: IAudience[] = [sampleWithRequiredData];
        expectedResult = service.addAudienceToCollectionIfMissing(audienceCollection, ...audienceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const audience: IAudience = sampleWithRequiredData;
        const audience2: IAudience = sampleWithPartialData;
        expectedResult = service.addAudienceToCollectionIfMissing([], audience, audience2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(audience);
        expect(expectedResult).toContain(audience2);
      });

      it('should accept null and undefined values', () => {
        const audience: IAudience = sampleWithRequiredData;
        expectedResult = service.addAudienceToCollectionIfMissing([], null, audience, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(audience);
      });

      it('should return initial array if no Audience is added', () => {
        const audienceCollection: IAudience[] = [sampleWithRequiredData];
        expectedResult = service.addAudienceToCollectionIfMissing(audienceCollection, undefined, null);
        expect(expectedResult).toEqual(audienceCollection);
      });
    });

    describe('compareAudience', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAudience(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAudience(entity1, entity2);
        const compareResult2 = service.compareAudience(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAudience(entity1, entity2);
        const compareResult2 = service.compareAudience(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAudience(entity1, entity2);
        const compareResult2 = service.compareAudience(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
