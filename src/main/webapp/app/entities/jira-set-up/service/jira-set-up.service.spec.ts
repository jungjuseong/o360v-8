import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IJiraSetUp } from '../jira-set-up.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../jira-set-up.test-samples';

import { JiraSetUpService } from './jira-set-up.service';

const requireRestSample: IJiraSetUp = {
  ...sampleWithRequiredData,
};

describe('JiraSetUp Service', () => {
  let service: JiraSetUpService;
  let httpMock: HttpTestingController;
  let expectedResult: IJiraSetUp | IJiraSetUp[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(JiraSetUpService);
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

    it('should create a JiraSetUp', () => {
      const jiraSetUp = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(jiraSetUp).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a JiraSetUp', () => {
      const jiraSetUp = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(jiraSetUp).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a JiraSetUp', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of JiraSetUp', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a JiraSetUp', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addJiraSetUpToCollectionIfMissing', () => {
      it('should add a JiraSetUp to an empty array', () => {
        const jiraSetUp: IJiraSetUp = sampleWithRequiredData;
        expectedResult = service.addJiraSetUpToCollectionIfMissing([], jiraSetUp);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jiraSetUp);
      });

      it('should not add a JiraSetUp to an array that contains it', () => {
        const jiraSetUp: IJiraSetUp = sampleWithRequiredData;
        const jiraSetUpCollection: IJiraSetUp[] = [
          {
            ...jiraSetUp,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addJiraSetUpToCollectionIfMissing(jiraSetUpCollection, jiraSetUp);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a JiraSetUp to an array that doesn't contain it", () => {
        const jiraSetUp: IJiraSetUp = sampleWithRequiredData;
        const jiraSetUpCollection: IJiraSetUp[] = [sampleWithPartialData];
        expectedResult = service.addJiraSetUpToCollectionIfMissing(jiraSetUpCollection, jiraSetUp);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jiraSetUp);
      });

      it('should add only unique JiraSetUp to an array', () => {
        const jiraSetUpArray: IJiraSetUp[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const jiraSetUpCollection: IJiraSetUp[] = [sampleWithRequiredData];
        expectedResult = service.addJiraSetUpToCollectionIfMissing(jiraSetUpCollection, ...jiraSetUpArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const jiraSetUp: IJiraSetUp = sampleWithRequiredData;
        const jiraSetUp2: IJiraSetUp = sampleWithPartialData;
        expectedResult = service.addJiraSetUpToCollectionIfMissing([], jiraSetUp, jiraSetUp2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jiraSetUp);
        expect(expectedResult).toContain(jiraSetUp2);
      });

      it('should accept null and undefined values', () => {
        const jiraSetUp: IJiraSetUp = sampleWithRequiredData;
        expectedResult = service.addJiraSetUpToCollectionIfMissing([], null, jiraSetUp, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jiraSetUp);
      });

      it('should return initial array if no JiraSetUp is added', () => {
        const jiraSetUpCollection: IJiraSetUp[] = [sampleWithRequiredData];
        expectedResult = service.addJiraSetUpToCollectionIfMissing(jiraSetUpCollection, undefined, null);
        expect(expectedResult).toEqual(jiraSetUpCollection);
      });
    });

    describe('compareJiraSetUp', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareJiraSetUp(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareJiraSetUp(entity1, entity2);
        const compareResult2 = service.compareJiraSetUp(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareJiraSetUp(entity1, entity2);
        const compareResult2 = service.compareJiraSetUp(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareJiraSetUp(entity1, entity2);
        const compareResult2 = service.compareJiraSetUp(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
