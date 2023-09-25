import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IJira } from '../jira.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../jira.test-samples';

import { JiraService } from './jira.service';

const requireRestSample: IJira = {
  ...sampleWithRequiredData,
};

describe('Jira Service', () => {
  let service: JiraService;
  let httpMock: HttpTestingController;
  let expectedResult: IJira | IJira[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(JiraService);
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

    it('should create a Jira', () => {
      const jira = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(jira).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Jira', () => {
      const jira = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(jira).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Jira', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Jira', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Jira', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addJiraToCollectionIfMissing', () => {
      it('should add a Jira to an empty array', () => {
        const jira: IJira = sampleWithRequiredData;
        expectedResult = service.addJiraToCollectionIfMissing([], jira);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jira);
      });

      it('should not add a Jira to an array that contains it', () => {
        const jira: IJira = sampleWithRequiredData;
        const jiraCollection: IJira[] = [
          {
            ...jira,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addJiraToCollectionIfMissing(jiraCollection, jira);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Jira to an array that doesn't contain it", () => {
        const jira: IJira = sampleWithRequiredData;
        const jiraCollection: IJira[] = [sampleWithPartialData];
        expectedResult = service.addJiraToCollectionIfMissing(jiraCollection, jira);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jira);
      });

      it('should add only unique Jira to an array', () => {
        const jiraArray: IJira[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const jiraCollection: IJira[] = [sampleWithRequiredData];
        expectedResult = service.addJiraToCollectionIfMissing(jiraCollection, ...jiraArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const jira: IJira = sampleWithRequiredData;
        const jira2: IJira = sampleWithPartialData;
        expectedResult = service.addJiraToCollectionIfMissing([], jira, jira2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jira);
        expect(expectedResult).toContain(jira2);
      });

      it('should accept null and undefined values', () => {
        const jira: IJira = sampleWithRequiredData;
        expectedResult = service.addJiraToCollectionIfMissing([], null, jira, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jira);
      });

      it('should return initial array if no Jira is added', () => {
        const jiraCollection: IJira[] = [sampleWithRequiredData];
        expectedResult = service.addJiraToCollectionIfMissing(jiraCollection, undefined, null);
        expect(expectedResult).toEqual(jiraCollection);
      });
    });

    describe('compareJira', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareJira(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareJira(entity1, entity2);
        const compareResult2 = service.compareJira(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareJira(entity1, entity2);
        const compareResult2 = service.compareJira(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareJira(entity1, entity2);
        const compareResult2 = service.compareJira(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
