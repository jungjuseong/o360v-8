import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IProjectDate } from '../project-date.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../project-date.test-samples';

import { ProjectDateService, RestProjectDate } from './project-date.service';

const requireRestSample: RestProjectDate = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('ProjectDate Service', () => {
  let service: ProjectDateService;
  let httpMock: HttpTestingController;
  let expectedResult: IProjectDate | IProjectDate[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProjectDateService);
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

    it('should create a ProjectDate', () => {
      const projectDate = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(projectDate).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProjectDate', () => {
      const projectDate = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(projectDate).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProjectDate', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProjectDate', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ProjectDate', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addProjectDateToCollectionIfMissing', () => {
      it('should add a ProjectDate to an empty array', () => {
        const projectDate: IProjectDate = sampleWithRequiredData;
        expectedResult = service.addProjectDateToCollectionIfMissing([], projectDate);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(projectDate);
      });

      it('should not add a ProjectDate to an array that contains it', () => {
        const projectDate: IProjectDate = sampleWithRequiredData;
        const projectDateCollection: IProjectDate[] = [
          {
            ...projectDate,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addProjectDateToCollectionIfMissing(projectDateCollection, projectDate);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProjectDate to an array that doesn't contain it", () => {
        const projectDate: IProjectDate = sampleWithRequiredData;
        const projectDateCollection: IProjectDate[] = [sampleWithPartialData];
        expectedResult = service.addProjectDateToCollectionIfMissing(projectDateCollection, projectDate);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(projectDate);
      });

      it('should add only unique ProjectDate to an array', () => {
        const projectDateArray: IProjectDate[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const projectDateCollection: IProjectDate[] = [sampleWithRequiredData];
        expectedResult = service.addProjectDateToCollectionIfMissing(projectDateCollection, ...projectDateArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const projectDate: IProjectDate = sampleWithRequiredData;
        const projectDate2: IProjectDate = sampleWithPartialData;
        expectedResult = service.addProjectDateToCollectionIfMissing([], projectDate, projectDate2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(projectDate);
        expect(expectedResult).toContain(projectDate2);
      });

      it('should accept null and undefined values', () => {
        const projectDate: IProjectDate = sampleWithRequiredData;
        expectedResult = service.addProjectDateToCollectionIfMissing([], null, projectDate, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(projectDate);
      });

      it('should return initial array if no ProjectDate is added', () => {
        const projectDateCollection: IProjectDate[] = [sampleWithRequiredData];
        expectedResult = service.addProjectDateToCollectionIfMissing(projectDateCollection, undefined, null);
        expect(expectedResult).toEqual(projectDateCollection);
      });
    });

    describe('compareProjectDate', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareProjectDate(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareProjectDate(entity1, entity2);
        const compareResult2 = service.compareProjectDate(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareProjectDate(entity1, entity2);
        const compareResult2 = service.compareProjectDate(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareProjectDate(entity1, entity2);
        const compareResult2 = service.compareProjectDate(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
